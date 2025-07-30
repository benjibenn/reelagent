// Import necessary modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia } = require("@remotion/renderer");
const generateDynamicVideo = require("../src/generateDynamicVideo"); // Utility to create Remotion components dynamically
const { uploadToSupabase } = require("../libs/supabase/storage"); // Utility to upload files to Supabase storage

// Define the output directory for rendered videos
const outputDir = path.resolve(__dirname, "../out");
// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Initialize the Express application
const app = express();
// Define the port for the server, using environment variable or defaulting to 3000
const port = process.env.PORT || 3000;

// Apply middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json({ limit: "50mb" })); // Parse JSON bodies, increase limit for potentially large base64 inputs or parameters
app.use("/videos", express.static(outputDir)); // Serve rendered videos statically
app.use("/public", express.static(path.join(__dirname, "../public"))); // Serve static assets from the public directory

// Test endpoint to verify props are being received correctly
// Useful for debugging the frontend sending data
app.post("/test-props", (req, res) => {
  console.log("Test endpoint received:", req.body);
  res.json({
    received: req.body,
    message: "Props received successfully",
  });
});

// Main endpoint to render a video based on provided parameters
app.post("/render-video", async (req, res) => {
  try {
    // Log the raw request body for debugging purposes
    console.log("Raw request body:", JSON.stringify(req.body));

    // Extract properties from the request body, providing default values
    const durationInSeconds = req.body.durationInSeconds || 10; // Video duration
    const audioOffsetInSeconds = req.body.audioOffsetInSeconds || 0; // Offset for the additional audio track
    const titleText = req.body.titleText || "Default Title"; // Text overlay
    const textPosition = req.body.textPosition || "bottom"; // Position of the text overlay
    const enableAudio = req.body.enableAudio !== false; // Flag to include additional audio, defaults to true

    // Extract parameters for split-screen functionality
    const splitScreen = req.body.splitScreen || false; // Enable split screen mode
    const splitPosition = req.body.splitPosition; // Defines the layout of the split screen (e.g., "left-right")

    // Extract direct URLs for media sources
    const videoSource = req.body.videoSourceUrl; // Main video source URL
    const demoVideoSource = req.body.demoVideoSourceUrl; // Secondary video source URL (for split screen)
    const audioSource = req.body.audioSourceUrl; // Additional audio track URL

    // Validate the splitPosition value if split screen mode is enabled
    const validSplitPositions = [
      "left-right",
      "right-left",
      "top-bottom",
      "bottom-top",
    ];
    if (splitScreen && !validSplitPositions.includes(splitPosition)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid splitPosition value. Must be one of: left-right, right-left, top-bottom, bottom-top",
      });
    }

    // Log extracted values for debugging to confirm correct processing
    console.log("\nExtracted titleText:", titleText);
    console.log("Duration of the Video (seconds):", durationInSeconds);
    console.log("Extracted textPosition:", textPosition);
    console.log("Enable additional audio:", enableAudio);
    console.log("Split screen mode:", splitScreen);
    console.log("Split screen position:", splitPosition);
    console.log("Video source URL:", videoSource);
    console.log("Demo video source URL:", demoVideoSource);
    console.log("Audio source URL:", audioSource);
    console.log("Audio offset (seconds):", audioOffsetInSeconds);

    // Generate a dynamic Remotion component file (.jsx) based on the received parameters
    console.log("\nGenerating dynamic component with title:", titleText);
    const { indexPath, componentName } = generateDynamicVideo({
      titleText,
      durationInSeconds,
      audioOffsetInSeconds,
      textPosition,
      videoSource,
      audioSource,
      enableAudio: !!audioSource, // Enable audio only if an audio source URL is provided
      splitScreen,
      demoVideoSource,
      splitPosition,
    });

    console.log("Generated dynamic component:", componentName);
    console.log("Dynamic index path:", indexPath); // Path to the temporary entry file for bundling

    // Generate a unique filename for the output video
    const outputFilename = `video-${Date.now()}.mp4`;
    const outputPath = path.resolve(outputDir, outputFilename); // Full path for the output video file

    // Bundle the dynamically generated Remotion project using Webpack
    console.log("Bundling dynamic component...");
    const bundled = await bundle({ // Use default bundling options
      entryPoint: indexPath, // The dynamically generated entry file
      webpackOverride: (config) => config, // No webpack overrides needed for this basic setup
     });


    // Retrieve composition details (like FPS, dimensions) from the bundled project
    const compositions = await getCompositions(bundled);
    // Find the specific composition generated dynamically
    const composition = compositions.find((c) => c.id === componentName);

    if (!composition) {
      throw new Error(`Composition '${componentName}' not found`);
    }

    // Calculate the total number of frames to render based on duration and FPS
    const durationInFrames = Math.floor(durationInSeconds * composition.fps);

    // Render the video using Remotion's renderer
    console.log("Starting render...");
    await renderMedia({
      composition, // The composition to render
      serveUrl: bundled, // The bundled project serve URL
      codec: "h264", // Video codec
      outputLocation: outputPath, // Where to save the rendered video
      durationInFrames, // Total frames to render
      timeoutInMilliseconds: 420000, // Set a 7-minute timeout for the entire render process
      delayRenderTimeoutInMilliseconds: 300000, // Set a 5-minute timeout specifically for delayRender() calls within Remotion

      // Log rendering progress to the console
      onProgress: (progress) => {
        // Use process.stdout.write with \r to update the progress on the same line
        process.stdout.write(
          `\rRendering progress: ${Math.floor(progress.progress * 100)}%`
        );

        // Add a newline character when rendering is complete (progress hits 100%)
        if (progress.progress === 1) {
          process.stdout.write("\n");
        }
      },
    });

    // Clean up the temporary files created during dynamic component generation
    try {
      fs.unlinkSync(indexPath); // Delete the temporary entry file (.js or .jsx)
      // Attempt to delete the corresponding component file (.jsx)
      // Note: generateDynamicVideo might create slightly different filenames, adjust if needed
      const componentFilePath = indexPath.replace(/index\.(js|jsx)$/, 'Video.jsx');
       if (fs.existsSync(componentFilePath)) {
         fs.unlinkSync(componentFilePath);
       }
      console.log("Cleaned up temporary component files");
    } catch (err) {
      // Log a warning if cleanup fails, but don't stop the process
      console.warn("Failed to clean up temporary component files:", err);
    }


    console.log("Video rendered successfully. Uploading to Supabase...");

    // Upload the final rendered video to Supabase storage
    const supabaseUrl = await uploadToSupabase(outputPath, outputFilename);
    console.log("Video uploaded to Supabase:", supabaseUrl); // Log the public URL

    // Clean up the locally rendered video file after successful upload
    try {
      fs.unlinkSync(outputPath);
      console.log("Deleted local video file");
    } catch (err) {
      // Log a warning if local file deletion fails
      console.warn("Failed to delete local video file:", err);
    }

    // Log separator for clarity in server logs
    console.log(
      "\n-------------------------------------------\n-------------------------------------------\n"
    );

    // Send a success response back to the client
    res.json({
      success: true,
      message: "Video rendered and uploaded successfully",
      videoUrl: supabaseUrl, // Provide the URL to access the video on Supabase
      // Include the parameters used for this render for potential debugging or verification
      usedValues: {
        titleText,
        textPosition,
        splitScreen,
        splitPosition,
        usedVideoSource: videoSource,
        usedDemoVideoSource: demoVideoSource,
        usedAudioSource: audioSource,
      },
    });
  } catch (error) {
    // Catch any errors during the process (bundling, rendering, uploading)
    console.error("Error rendering or uploading video:", error);
    // Send an error response back to the client
    res.status(500).json({
      success: false,
      message: "Failed to process video",
      error: error.message, // Include the error message
      stack: error.stack, // Include the stack trace for detailed debugging
    });
  }
});

// Start the Express server and listen on the defined port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}\n`);
});
