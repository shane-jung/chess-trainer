import axios from 'axios';

const gamesController = {
    getGame: async (req, res) => {
        const id = req.params.id;
        const response = await axios.get(`api/games/${id}`);
    }
}

export default gamesController;