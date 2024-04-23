import data from "$lib/constant/juz-map-surah";

export function findJuz(surah: number, verse: number): number {
	for (let i = 0; i < data.length; i++) {
		const juz = i + 1;
		const {
			start: { surah: startSurah },
			end: { surah: endSurah }
		} = data[i];
		if (surah >= startSurah && surah <= endSurah) {
			if (endSurah === surah) {
				if (data[i].end.verse < verse) return juz + 1;
			}
			return juz;
		}
	}
	return 0;
}

export default data;
