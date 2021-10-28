import albumService from "../services/album-service.js";


class albumController {
    async create(req, res) {
        try {
            const album = await albumService.create(req.body, req.files);
            res.json(album);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    async getAll(req, res) {
        try {
            const albums = await albumService.getAll();
            return res.json(albums);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params;
            const album = await albumService.getOne(id)
            return res.json(album);

        } catch (error) {
            res.status(500).json(error.message);
        } 
    }

    async update(req, res) {
        try {
            const album = req.body;
            const updatedAlbum = await albumService.update(album);
            return res.json(updatedAlbum);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            const album = await albumService.delete(id);
            return res.json(album);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

export default new albumController();