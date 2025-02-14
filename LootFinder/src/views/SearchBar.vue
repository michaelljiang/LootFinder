<template>
    <div class="container">
        <input v-model="query" type="text" placeholder="Search for users" @input="search" class="search-bar" />
        <ul v-if="results.length">
            <li v-for="(result, index) in results" :key="index">{{ result }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            query: '',
            results: []
        };
    },
    methods: {
        search() {
        // Dummy search logic, replace with actual API call
            const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
            this.results = items.filter(item => item.toLowerCase().includes(this.query.toLowerCase()));
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin-top: -50px;
}

.search-bar {
    width: 100%;
    max-width: 500px; /* Equivalent to sm:w-64 */
    padding: 8px; /* Equivalent to p-2 */
    border: 1px solid #d1d5db; /* Equivalent to border-gray-300 */
    border-radius: 4px; /* Equivalent to rounded */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Equivalent to shadow-sm */
    outline: none; /* Equivalent to focus:outline-none */
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.search-bar:focus {
  border-color: #93c5fd; /* Equivalent to focus:border-blue-300 */
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.5); /* Equivalent to focus:ring */
}

ul {
    list-style: none;
    padding: 0;
    margin-top: 10px;
}

li {
    padding: 5px 0;
}
</style>
