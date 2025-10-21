// PM2 Ecosystem Configuration for TASKGD
// Domain: task.ninh.app
// Port: 3002

export default {
  apps: [
    {
      name: 'taskgd',
      script: './node_modules/.bin/tsx',
      args: 'server/api.ts',
      cwd: '/data/Ninh/projects/taskgd',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        API_PORT: 3002,
        DATABASE_URL: 'postgresql://nihdev:haininh1@localhost:5432/taskgd_db',
      },
      error_file: '/data/Ninh/projects/taskgd/logs/error.log',
      out_file: '/data/Ninh/projects/taskgd/logs/out.log',
      log_file: '/data/Ninh/projects/taskgd/logs/combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};

