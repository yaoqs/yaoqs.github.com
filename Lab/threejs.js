const demo_cube_rot={
    canvasContainer:null,
    cwidth:null,
    cheight:null,
    renderer:null,
    canvas:null,
    scene:null,
    camera:null,
    geometry:null,
    material:null,
    cube:null,
    colock:null,
    init(id){
    canvasContainer = document.getElementById(id);
    cwidth = canvasContainer.clientWidth;  //获取画布的宽
    cheight = canvasContainer.clientHeight;  //获取画布的高
    renderer = new THREE.WebGLRenderer({
            antialias: true,  //抗锯齿开
            alpha: true, // canvas是否包含alpha (透明度) 默认为 false
            precision: 'highp',
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(cwidth, cheight);  //设置渲染器的宽和高
    renderer.setClearColor(0x000000); //设置渲染器的背景颜色为黑色
    renderer.setClearAlpha(0.0) // 设置alpha，合法参数是一个 0.0 到 1.0 之间的浮点数
    canvas = renderer.domElement; //获取渲染器的画布元素
    canvasContainer.appendChild(canvas); //将画布写入html元素中
    scene = new THREE.Scene();
    const fov = 40 // 视野范围
    const aspect = 2 // 相机默认值 画布的宽高比
    const near = 0.1 // 近平面
    const far = 10000 // 远平面
    camera = new THREE.OrthographicCamera(-6, 6, 4.5, -4.5, 0, 50); //创建照相机
    camera.position.set(35, 15, 25);  //设置照相机的位置
    camera.lookAt(new THREE.Vector3(0, 0, 0)); //设置照相机面向(0,0,0)坐标观察照相机默认坐标为(0,0,0);默认面向为沿z轴向里观察;
    var light = new THREE.PointLight(0xffffff, 1, 100);  //创建光源
    light.position.set(12, 15, 10);  //设置光源的位置
    scene.add(light);  //在场景中添加光源
    // 顶点着色器
    const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main(){
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);

            vUv=uv;
            vPosition=position;
    }
    `
    // 片元着色器
    const fragmentShader = `
    precision mediump int;
    precision highp float;

    uniform float uTime;
    varying vec2 vUv;
    uniform vec3 u_resolution;
    varying vec3 vPosition;

    void main(){
            vec3 topleft = vec3( 2.5,2.5,2.5 );
            vec3 bottomright=vec3(-2.5,-2.5,-2.5);
            float dist=  distance(topleft,bottomright);

            float r = vPosition.x/dist+0.5;
            float g = vPosition.y/dist+0.5;
            float b = vPosition.z/dist+0.5;
            gl_FragColor = vec4(r, g, b, 1);

    }
    `
    geometry = new THREE.BoxGeometry (5, 5, 5);

    material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                    uTime: {
                            value: 0
                            },
                            ratio:{
                                    value:0
                            }
                    }
            });
    //创建形状和材质之后，就可以创建该物体了：
    //创建物体
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    renderer.render(scene, camera);

    // Clock
    clock = new THREE.Clock();
},
play(){
    // Animations
    tick=()=>{
        // stats.begin()
        
            const elapsedTime = clock.getElapsedTime()
        
            cube.position.y = Math.sin(elapsedTime)
            cube.position.x = Math.cos(elapsedTime)
            cube.rotation.y += 0.01
            cube.rotation.x += 0.01
        
            //material.color.set(100,100,100)
            //material.uniforms.uTime.value+=0.01
            material.uniforms.ratio.value += 10;
        
            // Render
            renderer.render(scene, camera)
            //stats.end()
            requestAnimationFrame(tick)
            }
            tick()
    }
}