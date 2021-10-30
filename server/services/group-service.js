import Group from "../models/group.js";

class GroupService {
	async create(group) {
		const createdGroup = await Group.create(group);
		return createdGroup;
	}

	async getAll() {
		const groups = await Group.find();
		return groups;
	}

	async getOne(id) {
		if (!id) throw new Error("ID не указан");
		const group = await Group.findById(id);
		return group;
	}

	async update(group) {
		if (!group._id) throw new Error("ID не указан");
		const updatedGroup = await Group.findByIdAndUpdate(group._id, group, {
			new: true
		});
		return updatedGroup;
	}

	async delete(id) {
		if (!id) throw new Error("ID не указан");
		const group = await Group.findByIdAndDelete(id);
		return group;
	}
}

export default new GroupService();
