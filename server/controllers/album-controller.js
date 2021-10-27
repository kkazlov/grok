import albumService from "../services/album-service.js";


class albumController {
    async create(req, res) {
        try {
            const album = await albumService.create(req.body);
            res.json(album);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getAll(req, res) {
        try {
            const albums = await albumService.getAll();
            return res.json(albums);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params;
            const album = await albumService.getOne(id)
            return res.json(album);

        } catch (error) {
            res.status(500).json(error);
        } 
    }

    async update(req, res) {
        try {
            const album = req.body;
            const updatedAlbum = await albumService.update(album);
            return res.json(updatedAlbum);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            const album = await albumService.delete(id);
            return res.json(album);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default new albumController();