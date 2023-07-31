const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:3004/users');
        if (!response.ok) {
            throw new Error(`Error:${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log(error, 'Error');
        return [];
    }
};

export default fetchData;