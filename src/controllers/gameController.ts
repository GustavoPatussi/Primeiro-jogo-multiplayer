import { fruit, player } from "../models/game";

interface game {
    canvasWidth: number,
    canvasHeight: number,
    players: {[socketId: string]: player},
    fruits: {[fruitId: number]: fruit},
    addPlayer(socketId: string): player,
    removePlayer(socketId: string): void,   
    movePlayer(socketId: string, direction: string): player,
    addFruit(): boolean | object,
    removeFruit(fruitId: number): void,
    checkForFruitColision(): string | void,
    clearScores(): void
}

export class CreateGame implements game {
    canvasWidth: number;
    canvasHeight: number;
    players: {[socketId: string]: player};
    fruits: {[fruitId: number]: fruit};
    constructor(){
        this.canvasWidth = 35;
        this.canvasHeight = 30;
        this.players = {};
        this.fruits = {};
    }

    addPlayer(socketId: string): player {
        return this.players[socketId] = {
            name: socketId,
            x: Math.floor(Math.random() * this.canvasWidth),
            y: Math.floor(Math.random() * this.canvasHeight),
            score: 0
          }
    }

    removePlayer(socketId: string): void {
        delete this.players[socketId];
    }

    movePlayer(socketId: string, direction: string): player {
        const player = this.players[socketId];
        if (direction === 'left' && player.x - 1 >= 0) {
            player.x = player.x - 1
          }
      
          if (direction === 'up' && player.y - 1 >= 0) {
            player.y = player.y - 1
          }
      
          if (direction === 'right' && player.x + 1 < this.canvasWidth) {
            player.x = player.x + 1
          }
      
          if (direction === 'down' && player.y + 1 < this.canvasHeight) {
            player.y = player.y + 1
          }
        return player
    }

    addFruit(): boolean | object {
        const fruitRandomId = Math.floor(Math.random() * 10000000);
        const fruitRandomX = Math.floor(Math.random() * this.canvasWidth);
        const fruitRandomY = Math.floor(Math.random() * this.canvasHeight);
        for (const fruitId in this.fruits) {
            const fruit = this.fruits[fruitId];
            if(fruitRandomX === fruit.x && fruitRandomY === fruit.y){
                return false;
            }
        }
        this.fruits[fruitRandomId] = {
            x: fruitRandomX,
            y: fruitRandomY
        }
        return {
            fruitId: fruitRandomId,
            x: fruitRandomX,
            y: fruitRandomY
        }
    }

    removeFruit(fruitId: number): void {
        delete this.fruits[fruitId];
    }

    checkForFruitColision(): void | string {
        for (const fruitId in this.fruits) {
            const fruit = this.fruits[fruitId];

            for (const socketId in this.players) {
                const player = this.players[socketId];                

                if(fruit.x === player.x && fruit.y === player.y){
                    player.score += 1;
                    delete this.fruits[fruitId];
                    return fruitId
                }
            }
        }
    }
    clearScores(): void {
        for (const socketId in this.players) {
            this.players[socketId].score = 0;
        }
    }
}