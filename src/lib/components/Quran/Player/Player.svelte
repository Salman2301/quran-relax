<script lang="ts">
	import { showSidebar } from "$lib/components/Sidebar/sidebar.store";
	import LoaderIcon from "$lib/icons/LoaderIcon.svelte";
	import { currentReciterName, isContentLoading } from "$lib/stores/player.store";

</script>

<div class="container">
	<div class="container-body">
    <div class="current-surah">
      <span>1- The Opening Surah / 1 Juz</span>
      <span>
        {#if $isContentLoading}
          <LoaderIcon />
        {/if}
      </span>
    </div>
    <div class="verse">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
    <div class="translate">1. English translation below</div>
    <div class="reciter">
      <button on:click={()=>($showSidebar="reciter")} class="reciter-btn">
        <div class="reciter-dash"></div>
        <span>{$currentReciterName}</span>
      </button>
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
  .reciter  {
    display: flex;
    justify-content: end;
  }
  .reciter  button {
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
    height: 30px;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .reciter-btn:hover > .reciter-dash {
    background-color: #4c7eff;
  }
  .reciter-btn:hover > span {
    color: #4c7eff;
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
