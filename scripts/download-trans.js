import fs from 'fs';
import fetch from 'node-fetch';
// import indexJson from "../static/quran/index.json";

if (!fs.existsSync('./static/quran/trans')) {
	fs.mkdirSync('./static/quran/trans');
}

const jsonData  = fs.readFileSync('./static/quran/trans/index.json', 'utf8');
const indexJson = JSON.parse(jsonData);

for (const surah of indexJson) {
	const url = surah.dl;
	const filename = `${surah.id}.txt`;

	fetch(url)
		.then((res) => res.text())
		.then((text) => {
			fs.writeFileSync(`./static/quran/trans/${filename}`, text);
		});
}
