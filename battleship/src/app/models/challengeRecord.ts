export class ChallengeRecord {
    id: number
    player_1: string
    player_2: string
    board_id: number

    constructor(obj?) {
        this.id = obj && obj.id || null;
        this.player_1 = obj && obj.player_1 || null;
        this.player_2 = obj && obj.player_2 || null;
        this.board_id = obj && obj.board_id || null;
    }
}