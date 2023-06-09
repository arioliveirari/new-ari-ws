
import Phaser from "phaser";
import Player from "./assets/Player";
import Mapa from "./maps/Mapa1";

// Scene in class
class Scene1 extends Phaser.Scene {
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  monchi?: Player
  graphics?: Phaser.GameObjects.Graphics
  map?: Mapa
  canWin: boolean = false
  canRot: boolean = true
  normalito: boolean = true
  preload(this: Phaser.Scene) {
    /* Load assets for game */
    this.load.spritesheet("character", "/game/character.png", { frameWidth: 220, frameHeight: 162 });
    this.load.image("background", "/game/background.png");
    this.load.image("plataformaA", "/game/platform1.png");
    this.load.image("plataformaB", "/game/platform1B.png");
    this.load.image("plataforma2", "/game/platform2.png");
    this.load.image("asteroid", "/game/asteroid.png");
    this.load.image("asteroid2", "/game/asteroid2.png");
    this.load.image("coin", "/game/coin.png");
    this.load.image("portal", "/game/portal.png")
  }


  create(this: Scene1) {
    /* Controls */
    this.cursors = this.input.keyboard?.createCursorKeys()

    this.map = new Mapa(this);
    this.map.createMap();
    const { x, y } = this.map.startingPoint;
    this.monchi = new Player(this, x, y, "character", 2); 
    this.canWin = false
    this.canRot = true
    /* Camera */
    this.cameras.main.startFollow(this.monchi)
    

    const touch = () => {
      if (this.monchi) this.monchi.idle()
    }
    const float = () => {
      if (this.monchi) {
        this.monchi.setBounce(0)
        this.monchi.setGravityY(-2000)
        this.time.delayedCall(1000, () =>
        {
            this.monchi?.setFlipY(true)
            this.monchi?.body?.setOffset(70,0)
            this.monchi?.setBounceY(0)
        })
      }
    }

    const rotateCam = () => {
      this.normalito = false
      this.canRot = false
      let allowed = true
      if(allowed){
        let rotation = 0
        for(let i = 0 ; i < 13 ; i++){
          rotation = 3.1415*i/12
          this.time.delayedCall(100, () =>
            {
              this.cameras.main.setRotation(rotation)
            })
            if(i==12){allowed = false}
        }
      }
      else{  this.cameras.main.setRotation(3.1415)

      }
      }
    

    const noFloat = () => {
      this.normalito = true
      if (this.monchi) {
        this.time.delayedCall(100, () =>
        {
            this.monchi?.setGravity(0)
            this.cameras.main.setRotation(0)
            this.monchi?.setFlipY(false)
            this.monchi?.body?.setOffset(70,50)
            this.monchi?.setBounceY(0)
        })
    }
  }
    const lose = () => {
      this.scene.restart()
      this.normalito = true
    }
    const win = () => {
      if(this.canWin){
        this.scene.restart()
      }
    }
    const movingFloorsGrav = () => {
      this.monchi?.setVelocityY(300)
    }
    const movingFloorsGravRot = () => {
      this.monchi?.setVelocityY(-300)
    }
    const coinCollected = () => {
      if (this.map?.coin) {
        this.map.portal?.setTint(0x00ff00);
        this.canWin = true
        this.map.coin.setVisible(false);
        this.map.coin.clear(true)
      }
    }
    if(this.map.portal) this.map.portal.setTint(0xff0000)
    if (this.map.pisos) this.physics.add.collider(this.monchi, this.map.pisos, touch);
    if (this.map.pisos2) this.physics.add.collider(this.monchi, this.map.pisos2, float);
    if (this.map.pisos3) this.physics.add.collider(this.monchi, this.map.pisos3, rotateCam);
    if (this.map.coin) this.physics.add.overlap(this.monchi, this.map.coin, coinCollected);
    if (this.map.portal) this.physics.add.overlap(this.monchi, this.map.portal, win);
    if (this.map.pisos4) this.physics.add.collider(this.monchi, this.map.pisos4, noFloat);
    if (this.map.movingFloor) this.physics.add.collider(this.monchi, this.map.movingFloor, movingFloorsGrav);
    if (this.map.movingFloorRot) this.physics.add.collider(this.monchi, this.map.movingFloorRot, movingFloorsGravRot);

    this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Sprite, top: boolean, down: boolean, left: boolean, right: boolean) => {
      if (down || top) lose()
    }, this);
    //  .on('worldbounds', lose, this)


  }

  update(this: Scene1) {
    /* Attach controls to player */
    if (this.monchi && this.normalito) {
      this.monchi.checkMove(this.cursors)
      if(this.map) this.map.animateBackground(this.monchi)
    }
    else if (this.monchi && this.normalito == false){
      this.monchi?.checkMoveRot(this.cursors)
      if(this.map) this.map.animateBackground(this.monchi)
    }
  }
}

export default Scene1 