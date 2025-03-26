
# Self-Hosting Guide

This guide provides detailed instructions for self-hosting the ReelAgent application, including both the frontend and backend components.

## Architecture Overview

The application consists of two main components:
- **Frontend**: A React application that can be deployed to Vercel or any static hosting service
- **Backend**: A Supabase instance that provides database, authentication, storage, and API functionality

## Frontend Deployment (Vercel)

1. Fork the repository to your GitHub account
2. Connect your GitHub repository to Vercel
3. Configure the following environment variables:
   ```
   VITE_SUPABASE_URL=https://your-supabase-instance-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Deploy the application

## Backend Self-Hosting (Supabase)

### System Requirements
- Linux-based operating system (Ubuntu 20.04+ recommended)
- Docker and Docker Compose installed
- 4GB RAM minimum (8GB+ recommended)
- 2 CPU cores minimum
- 20GB disk space minimum
- Public IP address or domain name (for production use)

### Installation Steps

1. **Install Docker and Docker Compose** (if not already installed):
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Clone the Supabase repository**:
   ```bash
   git clone --depth 1 https://github.com/supabase/supabase
   cd supabase/docker
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Edit the `.env` file** with your configuration:
   - Set strong passwords for `POSTGRES_PASSWORD` and `JWT_SECRET`
   - Configure `SITE_URL` to your frontend URL
   - Set `API_EXTERNAL_URL` to your Supabase API URL
   - Configure SMTP settings if you want email functionality

5. **Start the Supabase services**:
   ```bash
   docker-compose up -d
   ```

6. **Access the Supabase Studio** at `http://your-server-ip:8000`

7. **Create your database schema**:
   - Go to the SQL Editor in Supabase Studio
   - Copy the contents of the generated `supabase-setup.sql` file
   - Run the SQL script

8. **Configure authentication providers** as needed

9. **Get your API credentials**:
   - Go to Project Settings > API
   - Copy the URL and anon key to use in your frontend deployment

### Configuring for Production Use

For a production environment, you should:

1. **Set up SSL/TLS**:
   - Use a reverse proxy like Nginx with Let's Encrypt
   - Update the Supabase configuration to use HTTPS

2. **Configure backups** for your PostgreSQL database:
   ```bash
   # Example backup script
   docker exec -t supabase_db_1 pg_dumpall -c -U postgres > backup.sql
   ```

3. **Set up monitoring** using tools like Prometheus and Grafana

4. **Configure firewall rules** to only expose necessary ports (typically 80/443)

## Connecting Frontend to Self-Hosted Backend

1. Update your frontend environment variables to point to your self-hosted Supabase instance:
   ```
   VITE_SUPABASE_URL=https://your-supabase-domain.com
   # or for local development
   VITE_SUPABASE_URL=http://your-server-ip:8000
   
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Deploy or rebuild your frontend application with these updated environment variables

## Troubleshooting

### Common Issues

1. **Connection Refused**:
   - Check that your Docker containers are running
   - Verify firewall settings allow traffic on the required ports

2. **Authentication Issues**:
   - Check that your JWT_SECRET is consistent
   - Verify the configuration of your auth providers

3. **Database Migration Errors**:
   - Run SQL commands one by one to identify specific issues
   - Check for conflicts with existing tables or data

### Getting Help

- Consult the [Supabase documentation](https://supabase.com/docs)
- Join the [Supabase Discord community](https://discord.supabase.com)
- Check the [GitHub issues](https://github.com/supabase/supabase/issues) for known problems

## Maintenance

### Updating Supabase

1. Pull the latest changes from the Supabase repository:
   ```bash
   cd supabase
   git pull
   ```

2. Update your Docker containers:
   ```bash
   cd docker
   docker-compose pull
   docker-compose up -d
   ```

### Database Backups

Set up regular database backups using a cron job:

```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * docker exec -t supabase_db_1 pg_dumpall -c -U postgres > /path/to/backups/backup_$(date +\%Y\%m\%d).sql
```
