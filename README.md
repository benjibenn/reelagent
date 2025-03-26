# ReelAgent Setup Documentation

GitHub link: https://github.com/rish9600/viralaiugc

Assets link: https://drive.google.com/drive/folders/1UsaV1nXoU672Ung-IEzENOaUMyW4wRR3?usp=drive_link

ReelAgent is an AI UGC content tool for TikTok. Frontend and DB are completely vibe-coded with Lovable.
 The tech stack includes Vite (React) for the frontend, Supabase for the database, Vercel for hosting, and a Node.js server that runs locally to render videos at no cost. You can use everything on the free tier of each service. T
he entire project was built in just 48 hours spread across one week. Feel free to use it, and don't hesitate to [reach out](https://x.com/rushabtated4) if you encounter any issues.

## Overview

This documentation provides step-by-step instructions for self-hosting the ReelAgent platform. The setup process consists of four main components:

1. Supabase (Database)
2. Vercel (Frontend)
3. Backend Server
4. Google Cloud Console (Authentication)

Total estimated setup time: 30 minutes

## Table of Contents

- Prerequisites
- [Step 1: Supabase Setup](https://supabase.com/)
- [Step 2: Vercel Frontend Deployment](https://vercel.com/)
- [Step 3: Backend Server Configuration](https://github.com/rish9600/viralaiugc)
- [Step 4: Authentication Setup](https://console.cloud.google.com/)
- Troubleshooting
- Additional Resources

## Prerequisites

- GitHub account
- Vercel account
- Google Cloud Console account
- Basic understanding of terminal/command line
- Node.js and npm installed locally

[![Watch the video](https://img.youtube.com/vi/lUQMGl2ZjgU/0.jpg)](https://www.youtube.com/watch?v=lUQMGl2ZjgU)

Image is clicable and redirects you to video documentation of the project: https://www.youtube.com/watch?v=lUQMGl2ZjgU (6.35 mins)


## Step 1: Supabase Setup

1. **Create a new Supabase project**
    - Navigate to [Supabase](https://supabase.com/)
    - Sign in or create an account
    - If this is your first time using Supabase, you'll be prompted to create an organization
    - Click "New Project"
2. **Configure your project**
    - Enter a name for your project
    - Create a strong database password and store it securely
    - Select the region closest to your target audience for optimal performance
    - Click "Create Project"
3. **Initialize database schema**
    - In the left navigation panel, click "SQL Editor"
    - Paste the SQL schema provided
    
    ```tsx
    -- Enum Types
    create type plan as enum ('free', 'pro', 'ultra');
    create type template_type as enum ('aiavatar', 'game', 'usergenerated');
    create type text_alignment as enum ('top', 'center', 'bottom');
    create type video_alignment as enum ('side', 'top', 'serial');
    create type video_type as enum ('aiugc', 'meme');
    
    -- Create Tables
    
    -- PLANS TABLE
    create table public.profiles (
      id uuid not null,
      username text null,
      avatar_url text null,
      created_at timestamp with time zone not null default now(),
      updated_at timestamp with time zone not null default now(),
      plan public.plan not null default 'free'::plan,
      credits integer not null default 3,
      email text null,
      constraint profiles_pkey primary key (id),
      constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
    );
    
    -- Set up Row Level Security (RLS)
    alter table public.profiles enable row level security;
    
    create policy "Users can update their own profile" on public.profiles
       for update to public using (auth.uid() = id);
    create policy "Users can view their own profile" on public.profiles
       for select to public using (auth.uid() = id);
    create policy "Users can delete their own profile" on public.profiles
      for delete to public using (auth.uid() = id);
    
    -- DEMO TABLE
    create table public.demo (
      id bigint generated by default as identity not null,
      created_at timestamp with time zone not null default now(),
      demo_link text not null,
      user_id uuid not null,
      constraint demo_pkey primary key (id),
      constraint demo_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
    );
    
    -- Set up Row Level Security (RLS)
    alter table public.demo enable row level security;
    
    create policy "Allow users to insert their own demos" on public.demo
       for insert to authenticated with check (user_id = auth.uid());
    create policy "Users can update their own demos" on public.demo
       for update to public using (auth.uid() = user_id);
    create policy "Allow users to view their own demos" on public.demo
       for select to authenticated using (user_id = auth.uid());
    create policy "Allow users to delete their own demos" on public.demo
      for delete to authenticated using (user_id = auth.uid());
    
    -- GENERATED IMAGES TABLE
    create table public.generated_images (
      id bigint generated by default as identity not null,
      created_at timestamp with time zone not null default now(),
      user_id uuid null default gen_random_uuid (),
      video_url text null,
      prompt text null,
      constraint generated_images_pkey primary key (id),
      constraint generated_images_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
    );
    
    -- Set up Row Level Security (RLS)
    alter table public.generated_images enable row level security;
    
    create policy "Users can insert their own generated images" on public.generated_images
       for insert to public with check (user_id = auth.uid());
    create policy "Users can update their own generated images" on public.generated_images
       for update to public using (auth.uid() = user_id);
    create policy "Users can view their own generated images" on public.generated_images
       for select to public using (user_id = auth.uid());
    create policy "Users can delete their own generated images" on public.generated_images
      for delete to public using (user_id = auth.uid());
    
    -- SOUNDS TABLE
    create table public.sound (
      id bigint generated by default as identity not null,
      created_at timestamp with time zone not null default now(),
      sound_link text not null,
      name text not null default 'audio name'::text,
      user_id uuid null,
      constraint sound_pkey primary key (id),
      constraint sound_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
    );
    
    -- Set up Row Level Security (RLS)
    alter table public.sound enable row level security;
    
    create policy "Users can insert their own sounds" on public.sound
       for insert to public with check (auth.uid() = user_id);
    create policy "Users can update their own sounds" on public.sound
       for update to public using (auth.uid() = user_id);
    create policy "Users can view sounds with null user_id or their own" on public.sound
       for select to public using ((user_id IS NULL) OR (auth.uid() = user_id));
    create policy "Users can delete their own sounds" on public.sound
      for delete to public using (auth.uid() = user_id);
    
    -- TEMPLATES TABLE
    create table public.templates (
      id bigint generated by default as identity not null,
      created_at timestamp with time zone not null default now(),
      video_link text not null,
      image_link text null,
      template_type public.template_type null default 'aiavatar'::template_type,
      user_id uuid null,
      constraint templates_pkey primary key (id),
      constraint templates_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
    );
    
    -- Set up Row Level Security (RLS)
    alter table public.templates enable row level security;
    
    create policy "Users can insert their own templates" on public.templates
       for insert to public with check (user_id = auth.uid());
    create policy "Users can update their own templates" on public.templates
       for update to public using (auth.uid() = user_id);
    create policy "Templates visible publicly" on public.templates
       for select to public using (true);
    create policy "Users can delete their own templates" on public.templates
      for delete to public using (user_id = auth.uid());
    
    -- GENERATED VIDEOS TABLE
    create table public.generated_videos (
      id uuid not null default gen_random_uuid (),
      created_at timestamp with time zone not null default now(),
      text_alignment public.text_alignment not null,
      video_alignment public.video_alignment null,
      video_type public.video_type not null,
      user_id uuid not null,
      demo_id bigint null,
      sound_id bigint null,
      template_id bigint null,
      remotion jsonb null,
      remotion_video text null,
      status text not null default 'pending'::text,
      error text null,
      caption text null,
      completed_at timestamp with time zone null,
      constraint generated_videos_pkey primary key (id),
      constraint generated_videos_demo_id_fkey foreign KEY (demo_id) references demo (id) on delete set null,
      constraint generated_videos_sound_id_fkey foreign KEY (sound_id) references sound (id) on delete set null,
      constraint generated_videos_template_id_fkey foreign KEY (template_id) references templates (id) on delete set null,
      constraint generated_videos_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
    );
    
    -- Set up Row Level Security (RLS)
    alter table public.generated_videos enable row level security;
    
    create policy "Users can insert their own generated videos" on public.generated_videos
       for insert to public with check (user_id = auth.uid());
    create policy "Users can update their own generated videos" on public.generated_videos
       for update to public using (auth.uid() = user_id);
    create policy "Users can view their own generated videos" on public.generated_videos
       for select to public using (user_id = auth.uid());
    create policy "Users can delete their own generated videos" on public.generated_videos
      for delete to public using (user_id = auth.uid());
    
    -- Enable Realtime for public.generated_videos
    alter publication supabase_realtime add table public.generated_videos;
    
    -----------------------
    -- Setup Auth Hooks
    -----------------------
    
    -- Create function to handle new user registration
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      INSERT INTO public.profiles (id, email)
      VALUES (new.id, new.email);
      RETURN new;
    END;
    $$;
    
    -- Create a trigger to call the function when a new user is created
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    
    -----------------------
    -- Storage Setup
    -----------------------
    
    -- Create storage buckets
    INSERT INTO storage.buckets (id, name, public)
    VALUES 
      ('sound', 'sound', true),
      ('template', 'template', true),
      ('generated-videos', 'generated-videos', true),
      ('user-templates', 'user-templates', true);
    
    -- User-templates bucket policies
    CREATE POLICY "Allow public to view files" 
      ON storage.objects FOR SELECT 
      USING (bucket_id = 'user-templates');
    
    CREATE POLICY "Allow users to delete their own files" 
      ON storage.objects FOR DELETE 
      USING (bucket_id = 'user-templates' AND auth.uid() = owner);
    
    CREATE POLICY "Allow users to update their own files" 
      ON storage.objects FOR UPDATE 
      USING (bucket_id = 'user-templates' AND auth.uid() = owner);
    
    CREATE POLICY "Allow users to upload their own files" 
      ON storage.objects FOR INSERT 
      WITH CHECK (bucket_id = 'user-templates' AND auth.uid() = owner);
    
    -- Global storage policies (for all buckets)
    CREATE POLICY "Allow authenticated users to upload demo videos" 
      ON storage.objects FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');
    
    CREATE POLICY "Allow users to view demo videos" 
      ON storage.objects FOR SELECT 
      USING (true);
    
    CREATE POLICY "Allow users to update their own demo videos" 
      ON storage.objects FOR UPDATE 
      USING (auth.uid() = owner);
    
    CREATE POLICY "Allow users to delete their own demo videos" 
      ON storage.objects FOR DELETE 
      USING (auth.uid() = owner);
    
    CREATE POLICY "Anyone can read user sounds" 
      ON storage.objects FOR SELECT 
      USING (true);
    
    CREATE POLICY "Users can upload their own sounds" 
      ON storage.objects FOR INSERT 
      WITH CHECK (auth.uid() = owner);
    
    -- Create folder structure in template bucket
    INSERT INTO storage.objects (bucket_id, name, owner, metadata)
    VALUES 
      ('template', 'sounds/.gitkeep', auth.uid(), '{"contentType": "application/octet-stream"}'),
      ('template', 'thumbnails/.gitkeep', auth.uid(), '{"contentType": "application/octet-stream"}'),
      ('template', 'videos/.gitkeep', auth.uid(), '{"contentType": "application/octet-stream"}');
    ```
    
    - Click "Run" to execute the query and set up your database tables, storage and RLS policies
4. **Retrieve API credentials**
    - Navigate to the "Home" tab in the Supabase dashboard or “Data API” from the project settings
    - Copy your Supabase URL, Anon Key and Service Role Key (you'll need these for subsequent steps)
    - Copy Callback URL from Authentication > Singin/up >Google (you'll need these for subsequent steps)
5. **Import sample data**
    - Navigate to the "Table Editor" in the left panel
    - Select the "sounds" table
    - Click "Import" and upload the provided [CSV file](https://drive.google.com/file/d/1VYaiKbKesFjsk4cDs9kM7A5cp2LSRpb6/view?usp=sharing) containing sample sounds
    - Repeat the process for the "templates" table using the [templates CSV file](https://drive.google.com/file/d/1xpugIgsV5pD0fj7XesAoJE1ufKndudeB/view?usp=sharing)

> Note: The imported data connects to pre-configured storage for testing purposes. For production, you'll need to upload your own sounds and templates to your Supabase storage.
You can configure all the assets by uploading them in Storage “sound” and “templates” respectively and create entries or just upload from frontend
 Assets link: https://drive.google.com/drive/folders/1UsaV1nXoU672Ung-IEzENOaUMyW4wRR3?usp=drive_link
> 

## Step 2: Vercel Frontend Deployment

1. **Fork the repository**
    - Navigate to the project's GitHub repository
    - Click "Fork" in the upper right corner
    - Copy the URL of your forked repository
2. **Deploy to Vercel**
    - Sign in to [Vercel](https://vercel.com/)
    - Click "Create a new Project"
    - Connect your GitHub account if not already connected
    - Import the forked repository
    - Select the "Frontend" directory from the "Root Directory" dropdown
3. **Configure environment variables**
    - In the Vercel deployment settings, add the following environment variables:
    
    ```
    VITE_SUPABASE_URL=<https://your-supabase-url>
    VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    
    ```
    
    - Replace the placeholders with your actual Supabase credentials
4. **Deploy the frontend**
    - Click "Deploy"
    - Wait for the deployment to complete
    - Once deployed, Vercel will provide you with a preview URL
    - Preview the app and see it in action!

## Step 3: Backend Server Configuration

You need to set up the backend to render videos (the server must be running whenever you want to generate videos). Carousels can be created without the server running. The server uses Remotion to render videos and connects to your database to save the generated videos in the appropriate storage location.

1. **Clone the repository locally**
    - Open your terminal
    - Run `git clone [https://github.com/your-username/your-forked-repo.git](https://github.com/rish9600/viralaiugc)`
    - Navigate to the cloned directory
2. **Configure environment variables**
    - Locate the `.env.example` file in the root directory
    - change the name to `.env` file
    - Update it with your Supabase credentials (you can find them in Project settings > Data API):
    
    ```
    # App
    PORT=3000
    RENDER_CONCURRENCY=5
    
    # Supabase
    SUPABASE_URL=<https://your-supabase-url>
    SUPABASE_KEY=<your-supabase-service-key>
    SUPABASE_STORAGE_BUCKET=generated-videos
    
    ```
    
3. **Install FFmpeg**
    - FFmpeg is required for video codec detection and processing
    - Installation instructions vary by operating system:
        - **macOS**: `brew install ffmpeg`
        - **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
        - **Windows**: Download from [FFmpeg.org](https://ffmpeg.org/download.html)
    - Installation may take 5-10 minutes
4. **Install dependencies and start the server**
    - run command  `cd backend` to go inside the backend folder
    - Run `npm install` to install all required packages in the backend folder
    - Once complete, run `npm start` to launch the backend server
    - The server should now be running on port 3000 (or as specified in your `.env` file)

## Step 4: Authentication Setup

1. **Create a Google Cloud project**
    - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
    - Click "Create Project" and enter a project name
    - Click "Create"
2. **Configure OAuth consent screen**
    - In the left navigation panel, go to "APIs & Services" > "OAuth consent screen"
    - Select "External" user type
    - Enter your application name and other required information
    - Save and continue
3. **Configure OAuth credentials**
    - In the left navigation panel, go to "APIs & Services" > "Credentials"
    - Click "Create Credentials" > "OAuth client ID"
    - Select "Web application" as the application type
    - Enter a name for your OAuth client
4. **Set up redirect URIs**
    - In Supabase, navigate to "Authentication" > "Providers"
    - Enable Google Auth
    - Copy the OAuth redirect URI provided by Supabase
    - Return to Google Cloud Console and add this URI to the "Authorized redirect URIs" field
    - Click "Create"
5. **Complete Google Auth setup in Supabase**
    - Google will provide you with a Client ID and Client Secret
    - In Supabase, paste these credentials into the Google Auth configuration
    - Save the configuration
6. **Update URL configuration**
    - In Supabase, navigate to "Authentication" > "URL Configuration"
    - Add your Vercel preview URL to both the Site URL and Redirect URLs sections

## Step 5: Using the Application

1. **Start using the app**
    - Your server and web app should be running fine at this point
    - Go to your Vercel preview URL
    - Sign up using the authentication you configured
    - Start generating videos and carousels
2. **Important note about video generation**
    - The local server must be active to generate and save videos
    - Carousels can be created without the server running
    - The server uses Remotion to render videos and connects to your database
3. **Before generating videos**
    - Open your IDE and project
    - Navigate to the backend directory: `cd backend`
    - Start the server using `npm start`
    - Keep the server running throughout your video generation session

> Note: You'll need to start the server each time you want to generate videos. The server does not need to be running for other application features like for generating carousels.
> 

## Troubleshooting

If you encounter issues during setup:

- **Database connection errors**: Verify your Supabase URL and Anon Key are correctly entered in all configuration files
- **FFmpeg installation issues**: Consult the [FFmpeg documentation](https://ffmpeg.org/documentation.html) for platform-specific installation guidance
- **Backend server not starting**: Check for error messages in the terminal and ensure all dependencies are installed correctly
- **Authentication errors**: Verify that your Google OAuth credentials are correctly configured in both Google Cloud Console and Supabase

## Additional Resources

- **Default Content**: The platform comes with 20 AI templates and 10 sounds for free video generation
- **Premium Templates**: Additional templates (100+) are available for purchase for $200 -  [contact here](https://x.com/rushabtated4)
- **Setup Assistance**: Professional setup services are available for $200 -  [contact here](https://x.com/rushabtated4)
- **Hosted Version**: If you are looking for hosted version for $199/yr with unlimited video generation, meme generation and more features - [contact here](https://x.com/rushabtated4)

For additional assistance or to purchase premium templates, [please contact support.](https://x.com/rushabtated4)
