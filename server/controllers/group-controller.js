import groupService from "../services/group-service.js";


class groupController {
    async create(req, res) {
        try {
            const group = await groupService.create(req.body);
            res.json(group);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getAll(req, res) {
        try {
            const groups = await groupService.getAll();
            return res.json(groups);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params;
            const group = await groupService.getOne(id)
            return res.json(group);

        } catch (error) {
            res.status(500).json(error);
        } 
    }

    async update(req, res) {
        try {
            const group = req.body;
            const updatedGroup = await groupService.update(group);
            return res.json(updatedGroup);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            const group = await groupService.delete(id);
            return res.json(group);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default new groupController();