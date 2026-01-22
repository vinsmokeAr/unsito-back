module.exports = {
    apps: [{
        name: 'unsito-back',
        script: './server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        // PM2 Log Configuration
        error_file: './logs/pm2-error.log',
        out_file: './logs/pm2-out.log',
        log_file: './logs/pm2-combined.log',
        time: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
        // Log rotation
        max_size: '10M',
        retain: 5,
        compress: true,
        // Restart configuration
        min_uptime: '10s',
        max_restarts: 10,
        restart_delay: 4000
    }]
};
