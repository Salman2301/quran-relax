<script lang="ts">
</script>

<div class="container">
	<div class="container-body">
    <div class="current-surah">1- The Opening Surah / 1 Juz</div>
    <div class="verse">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
    <div class="translate">1. English translation below</div>
    <div class="reciter">
      <div class="reciter-dash"></div>
      <span>Recitation Full Name</span>
    </div>
  </div>
	<div class="next-verse">English translation below</div>
</div>

<style lang="postcss">
  .container {
    background-color: #343434;
    border-radius: 8px;
    width: 580px;
    height: 350px;
    padding: 10px 20px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .reciter {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 4px;
    color: #ccc;
  }
  .reciter-dash {
    width: 18px;
    height: 2px;
    background-color: #ccc;
  }

  .reciter:hover {
    color: white;
  }

  .current-surah {
    font-size: 14px;
    font-weight: semibold;
    color: #ccc;
    margin-top: 10px;
  }
  .verse {
    text-align: center;
    font-size: 48px;
    /* font-family: "Amiri Quran"; */
    /* font-family: "Noto Sans Arabic"; */
    /* font-family: "Mirza"; */
    font-family: "Rubik", serif;
    margin: 30px 0;
  }

  .translate {
    font-weight: 200;
    font-size: 22px;
    text-align: center;
    margin: 10px 0px;
  }
  .next-verse {
    text-align: center;
    font-size: 13px;
    font-weight: 300;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
  }
</style>
