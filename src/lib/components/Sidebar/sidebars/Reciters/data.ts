const reciterId = [
	'abdulsamad',
	'as-sudais',
	'al-shatri',
	'al-shatri',
	'ar-rifai',
	'al-husary',
	'al-afasy',
	'al-minshawi',
	'ash-shuraym',
	'al-tablawi'
] as const;

interface ReciterOption {
  name: string;
  reciter_id: typeof reciterId[number];
  mode: string[];
  murattal_id: number | null;
  mujawwad_id: number | null;
	muallim_id: number | null;
}

const data: ReciterOption[] = [
	{
		name: 'AbdulBaset AbdulSamad',
		reciter_id: 'abdulsamad',
		mode: ['murattal', 'mujawwad'],
		murattal_id: 2,
		mujawwad_id: 1,
		muallim_id: null
	},
	{
		name: 'Abdur-Rahman as-Sudais',
		reciter_id: 'as-sudais',
		mode: ['murattal'],
		murattal_id: 3,
		mujawwad_id: null,
		muallim_id: null
	},
	{
		name: 'Abu Bakr al-Shatri',
		reciter_id: 'al-shatri',
		mode: ['murattal'],
		murattal_id: 4,
		mujawwad_id: null,
		muallim_id: null
	},
	{
		name: 'Hani ar-Rifai',
		reciter_id: 'ar-rifai',
		mode: ['murattal'],
		murattal_id: 5,
		mujawwad_id: null,
		muallim_id: null
	},
	{
		name: 'Mahmoud Khalil Al-Husary',
		reciter_id: 'al-husary',
		mode: ['murattal', 'muallim'],
		murattal_id: 6,
		mujawwad_id: null,
		muallim_id: 12
	},
	{
		name: 'Mishari Rashid al-`Afasy',
		reciter_id: 'al-afasy',
		mode: ['murattal'],
		murattal_id: 7,
		mujawwad_id: null,
		muallim_id: null
	},
	{
		name: 'Mohamed Siddiq al-Minshawi',
		reciter_id: 'al-minshawi',
		mode: ['murattal', 'mujawwad'],
		murattal_id: 9,
		mujawwad_id: 8,
		muallim_id: null
	},
	{
		name: 'Sa`ud ash-Shuraym',
		reciter_id: 'ash-shuraym',
		mode: ['murattal'],
		murattal_id: 10,
		mujawwad_id: null,
		muallim_id: null
	},
	{
		name: 'Mohamed al-Tablawi',
		reciter_id: 'al-tablawi',
		mode: ['mujawwad'],
		murattal_id: null,
		mujawwad_id: 11,
		muallim_id: null
	}
];

export const reciterIdMapUrl: Record<string, string> = {
	1: "https://verses.quran.com/AbdulBaset/Mujawwad/mp3/<id>.mp3",
	2: "https://verses.quran.com/AbdulBaset/Murattal/mp3/<id>.mp3",
	3: "https://verses.quran.com/Sudais/mp3/<id>.mp3",
	4: "https://verses.quran.com/Shatri/mp3/<id>.mp3",
	5: "https://verses.quran.com/Rifai/mp3/<id>.mp3",
	6: "https://mirrors.quranicaudio.com/everyayah/Husary_64kbps/<id>.mp3",
	7: "https://verses.quran.com/Alafasy/mp3/<id>.mp3",
	8: "https://verses.quran.com/Minshawi/Mujawwad/mp3/<id>.mp3",
	9: "https://verses.quran.com/Minshawi/Murattal/mp3/<id>.mp3",
	10: "https://verses.quran.com/Shuraym/mp3/<id>.mp3",
	11: "https://mirrors.quranicaudio.com/everyayah/Mohammad_al_Tablaway_128kbps/<id>.mp3",
	12: "https://mirrors.quranicaudio.com/everyayah/Husary_Muallim_128kbps/<id>.mp3"
}

export default data;
