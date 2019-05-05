function init() {

	var stats = initStats();
	var renderer = initRenderer({
		antialias:true
	});
	var camera = initCamera(new THREE.Vector3(0, 20, 40));
	var trackballControls = initTrackballControls(camera, renderer);
	var clock = new THREE.Clock();


	var scene = new THREE.Scene();

	initDefaultLighting(scene);
	scene.add(new THREE.AmbientLight(0x444444));

	var textureLoader = new THREE.TextureLoader();
	var gui = new dat.GUI();
	var controls = {};

	//这里要注意点和地球要组成一个组
	var group = new THREE.Object3D;
	scene.add(group);
	var sphere = new THREE.SphereGeometry(16, 40, 40, Math.PI / 2);//多面几何体
	var sphere = addGeometry(group, sphere, 'sphere', textureLoader.load('../../assets/textures/earth/Earth.png'), gui, controls);

	function getPos(v) {
		var theta = (v.lng + 180) * (Math.PI / 180),
			phi = (90 - v.lat) * (Math.PI / 180),
			radius = v.r;
		return (new THREE.Vector3()).setFromSpherical(new THREE.Spherical(radius, phi, theta));
	}

	//找到正确曲线上的点
	function interVector3(l) {
		if (l.v1.angleTo(l.v2) == 0) return l;		// 1
		if (l.v1.angleTo(l.v2) == Math.PI) l.v1.x--;  	// 2
		for (let i = 0; i < l.nums; ++i) {
			let newArr = [],
				j = 0;
			do {
				let newV,
					v_t1 = (new THREE.Vector3()).copy(l.vertices[j]),  // 3
					v_t2 = (new THREE.Vector3()).copy(l.vertices[j + 1]),
					m = v_t1.length() / v_t2.add(v_t1).length();  	// 4
				newV = v_t1.add(l.vertices[j + 1]).multiplyScalar(m);
				newArr.push((new THREE.Vector3()).copy(l.vertices[j]));
				newArr.push((new THREE.Vector3()).copy(newV));
				j++;
			} while (j < l.vertices.length - 1)
			newArr.push((new THREE.Vector3()).copy(l.vertices[j]));
			l.vertices = newArr;
		}
		return l;
	}

	function getDistance(start, end) {
		var line = new THREE.Line3(start, end);
		return line.distance();
	}

	var linesGroup = new THREE.Object3D();
	group.add(linesGroup);
	var material = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});


	function drawLine(csv, v0) {
		var csvLen = csv.length;
		var v1 = getPos(csv[Math.floor(Math.random() * csvLen)]);


		var VectorsArray = interVector3({
			v1: v0,
			v2: v1,
			nums: 5,
			vertices: [v0, v1]
		})

		var curve = new THREE.CatmullRomCurve3(VectorsArray.vertices);
		// var distance = getDistance(v0, v1);

		//获取曲线上的点
		var curvePoints = curve.getPoints(400);
		var geometry = new THREE.Geometry();



		geometry.index = 0;
		geometry.v = curvePoints;
		// geometry.length = curvePoints.length;
		// geometry.vertices.push(curvePoints[0]);
		for(let i=0,len=geometry.v.length;i<len;++i){
			geometry.vertices.push(geometry.v[geometry.index])
		}
		var material = new THREE.LineBasicMaterial({ 
			color : new THREE.Color(0xffffff*Math.random())
		});
		var line = new THREE.Line(geometry, material)
		linesGroup.add(line);
	}

	function addLines(v0, nums, csv) {
		for (var i = 0; i < nums; i++) {
			drawLine(csv, v0);
		}

	}

	function upDateLines() {
		// if (linesGroup.children.length) {
		// 	linesGroup.children.forEach(line => {
		// 		let geometry = line.geometry;
		// 		geometry.index++;
		// 		console.log(geometry.index,geometry.length,88)
		// 		if (geometry.index > 199) {
		// 			geometry.index = 0;
		// 			geometry.vertices.length = 0;
		// 			geometry.vertices.push(geometry.points[0]);
		// 		} else {
		// 			geometry.vertices.push(geometry.points[geometry.index]);
		// 			console.log(geometry.vertices,8899)
					
		// 		}
		// 		geometry.verticesNeedUpdate = true;
		// 	})
		// }
		for(var i=0,len = linesGroup.children.length;i<len;++i){
			var l = linesGroup.children[i].geometry;
			l.index++;
			if(l.index>l.v.length){
				l.index=0;
				for(var k=0;k<l.v.length;++k){
					l.vertices[k] = l.v[0];
					// l.verticesNeedUpdate = true;
				}
			}
			for(var j=0;j<l.index;++j){
				l.vertices[l.vertices.length-1-j] = l.v[j];
				l.verticesNeedUpdate = true;
			}
		}
	}




	var csv = [];
	//用fetch来读取csv很方便
	fetch("airport.csv").then(v => v.text())
		.then(data => {
			splitdate = data.split(/\s+/);

			//区分points和sprite
			//points:Geometry中放入多个顶点，THREE.Points会将每一个顶点添加材质，比每个点生层一个几何体性能更好
			//sprite:Sprite是一个永远面向相机的平面，通常用来加载纹理，并且，sprite不接受阴影,用sprite来格式化外部图片粒子，会显得轻而易举
			for (var i = 0; i < splitdate.length; i++) {
				var data = splitdate[i].split(",");
				if (i != 0 && data[3]) {
					csv.push({
						lng: parseFloat(data[3]),
						lat: parseFloat(data[2]),
						r: 16
					})
					//此处一定要注意使用parseFloat，否则经纬度会不准确
				}
			}



			addLines(getPos(csv[0]), 30, csv);

			// drawLine(csv, v0)
		})



	render();
	function render() {
		stats.update();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		group.rotation.y += 0.005
		upDateLines();
		trackballControls.update(clock.getDelta());
	}

}
