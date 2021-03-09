module.exports = {
    projects: [
        {
            name: 'r10-frontend',
            path: '/Users/rohmanahmad/PATH_TO_FOLDER/r10-frontend',
            excluded_files: [
                '_data'
            ]
        }
    ],
    servers: [
        {
            ip: '1**.6**.1**.9',
            port: '22',
            paths: [
                '/home/deploy/domain.co'
            ],
        }
    ],
    commands: {
        before: [
            'npm run build-staging'
        ],
        after: [
            'mv PATH /tmp'
        ]
    }
}