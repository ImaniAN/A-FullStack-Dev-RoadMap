<script>
	export let data;
</script>

<label for="form-spoken-languages" class="block text-sm font-medium text-slate-700"
	>task_overview
</label>
<select
	placeholder="Click..."
	autocomplete=""
	id=""
	name=""
	class="mt-1 rounded-lg flex-1 appearance-none border-2 border-teal-400 border-dashed w-full py-2 px-4 bg-indigo-50 text-slate-700 placeholder-amber-500 text-base focus:ring-indigo-600 focus:border-transparent shadow focus:outline-none focus:ring"
>
	<option value="" disabled selected hidden>Click...</option>
	{#each data.task_overview as task_overviews}
		<option>{task_overviews.task_name}</option>
	{/each}
</select>