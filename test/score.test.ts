import tap from 'tap';

interface GameScore {
    id: number;
    score: number;
    gameId: number;
    accountId: number;
    createdAt: string;
    accountAddress: string;
    gameName: string;
    updatedAt: string;
}

const mockScoreData: GameScore[] = [
    {
        id: 13,
        score: 40,
        gameId: 3,
        accountId: 28,
        createdAt: "2025-01-20 05:28:08.26159",
        accountAddress: "0x897575",
        gameName: "merge_game",
        updatedAt: "2025-01-20 05:29:03.267581"
    },
    {
        id: 12,
        score: 26,
        gameId: 3,
        accountId: 31,
        createdAt: "2025-01-20 05:10:23.380842",
        accountAddress: "0x8975756",
        gameName: "merge_game",
        updatedAt: "2025-01-20 05:20:23.756575"
    }
];

tap.test('Game Score Data Tests', async (t) => {
    t.test('should have valid score data structure', async (t) => {
        mockScoreData.forEach(scoreData => {
            t.hasProps(scoreData, ['id', 'score', 'gameId', 'accountId', 'createdAt', 'accountAddress', 'gameName', 'updatedAt']);
        });
    });

    t.test('should have valid score values', async (t) => {
        mockScoreData.forEach(scoreData => {
            t.type(scoreData.score, 'number');
            t.ok(scoreData.score >= 0, 'score should be non-negative');
        });
    });

    t.test('should have valid timestamps', async (t) => {
        mockScoreData.forEach(scoreData => {
            const createdDate = new Date(scoreData.createdAt);
            const updatedDate = new Date(scoreData.updatedAt);
            t.ok(!isNaN(createdDate.getTime()), 'createdAt should be a valid date');
            t.ok(!isNaN(updatedDate.getTime()), 'updatedAt should be a valid date');
            t.ok(updatedDate >= createdDate, 'updatedAt should be after or equal to createdAt');
        });
    });

    t.test('should have correct game name', async (t) => {
        mockScoreData.forEach(scoreData => {
            t.equal(scoreData.gameName, 'merge_game');
        });
    });

    t.test('should have valid ethereum addresses', async (t) => {
        mockScoreData.forEach(scoreData => {
            t.match(scoreData.accountAddress, /^0x[0-9a-fA-F]+$/);
        });
    });
});
