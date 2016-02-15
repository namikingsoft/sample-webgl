import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Component, PropTypes} from 'react'
import {List} from 'immutable'
import {
  Container,
  Graphics,
  autoDetectRenderer
} from 'pixi.js'

class Maru {

  constructor(private param: {
    sprite: PIXI.Sprite,
    direction: number,
    turningSpeed: number,
    speed: number,
    offset: number,
  }) {}

  get sprite() {
    return this.param.sprite
  }
  get direction() {
    return this.param.direction
  }
  get turningSpeed() {
    return this.param.turningSpeed
  }
  get speed() {
    return this.param.speed
  }
  get offset() {
    return this.param.offset
  }
  set direction(direction: number) {
    this.param.direction = direction
  }
}

export default class Canvas extends Component<any, any> {

  render() {
    return (
      <div className="module-canvas" ref="canvas" />
    )
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
  }

  private init() {
    //const renderer = autoDetectRenderer(800, 600, { transparent: true })
    const renderer = autoDetectRenderer(800, 600)
    this.canvasElement.appendChild(renderer.view)
    const stage = new Container

    // particle container
    var sprites = new PIXI.ParticleContainer(10000, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });
    stage.addChild(sprites);

    // generate particle sprite
    const maru = new Graphics
    maru.lineStyle(0)
    for (let i=1; i<=10; i++) {
      const opacity = 1 / i
      console.log(opacity)
      maru.beginFill(0xFFFF0B, opacity)
      maru.drawCircle(0, 0, i)
      maru.endFill()
    }
    const maruAny: any = maru // @todo

    let marus = List.of<Maru>()
    for (let i=0; i<10000; i++) {
      const sprite = new PIXI.Sprite(
        maruAny.generateTexture(60*60, PIXI.SCALE_MODES.DEFAULT)
      )
      sprite.x = Math.random() * renderer.width
      sprite.y = Math.random() * renderer.height
      sprite.tint = Math.random() * 0x808080
      const direction = Math.random() * Math.PI * 2
      const turningSpeed = Math.random() - 0.8;
      const speed = (2 + Math.random() * 2) * 0.4;
      const offset = Math.random() * 100;
      const maru = new Maru({
        sprite,
        direction,
        turningSpeed,
        speed,
        offset,
      })
      marus = marus.push(maru)
      sprites.addChild(sprite)
    }

    // bound
    var maruBoundsPadding = 100;
    var maruBounds = new PIXI.Rectangle(
      -maruBoundsPadding,
      -maruBoundsPadding,
      renderer.width + maruBoundsPadding * 2,
      renderer.height + maruBoundsPadding * 2
    )

    let tick = 0
    const animate = () => {
      marus.forEach(maru => {
        const sprite = maru.sprite
        sprite.scale.y = 0.95 + Math.sin(tick + maru.offset) * 0.05;
        maru.direction += maru.turningSpeed * 0.01;
        sprite.position.x += Math.sin(maru.direction) * (maru.speed * sprite.scale.y);
        sprite.position.y += Math.cos(maru.direction) * (maru.speed * sprite.scale.y);
        sprite.rotation = -maru.direction + Math.PI;

        // wrap the maggots
        if (sprite.position.x < maruBounds.x)
        {
            sprite.position.x += maruBounds.width;
        }
        else if (sprite.position.x > maruBounds.x + maruBounds.width)
        {
            sprite.position.x -= maruBounds.width;
        }

        if (sprite.position.y < maruBounds.y)
        {
            sprite.position.y += maruBounds.height;
        }
        else if (sprite.position.y > maruBounds.y + maruBounds.height)
        {
            sprite.position.y -= maruBounds.height;
        }
      })
      tick += 0.1;
      renderer.render(stage);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate)
  }

  private get canvasElement() {
    return ReactDOM.findDOMNode(this.refs['canvas'])
  }
}
