<script>
	let fps_30 = 100;
	let fps_60 = 100;
	let one_sec = 100;	

	setInterval(()=>{
		fps_30 += 1;
	}, 1000 / 30);
	setInterval(()=>{
		fps_60 += 1;
	}, 1000/ 60 );
	setInterval(()=>{
		one_sec += 1;
	}, 1000);
</script>

<p>fps_30: {fps_30}</p>
<p>fps_60: {fps_60}</p>
<p>one_sec: {one_sec}</p>
