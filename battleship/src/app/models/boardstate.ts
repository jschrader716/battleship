import { ɵangular_packages_router_router_n } from '@angular/router';

export class BoardState {
    id: number = 0;
    board_state_1: string = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    board_state_2: string = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    turn: number = 0;
    max_turn: number = 0;
    game_terminated: boolean = false;
    board_state_1_obj: Array<any> = [];
    board_state_2_obj: Array<any> = []; 

    constructor(obj?) {
        this.id = obj && obj.id || null;
        this.board_state_1 = obj && obj.board_state_1 || null;
        this.board_state_2 = obj && obj.board_state_2 || null;
        this.turn = obj && obj.turn || null;
        this.max_turn = obj && obj.max_turn || null;
        this.game_terminated = obj && obj.game_terminated || null;

        this.board_state_1_obj = this.buildBoard(this.board_state_1);
        this.board_state_2_obj = this.buildBoard(this.board_state_2);
    }

    buildBoard(stateString) {
        var arr = []
        // parse that shit
        for(var i = 0; i < 10; i++) {
            var row = [];
            for(var j = 0; j < 10; j ++) {
                row.push(stateString.charAt((i * 10) + j));
            }
            arr.push(row);
        }
        return arr;
    }
}
