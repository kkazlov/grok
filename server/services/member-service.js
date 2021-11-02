import Member from "../models/member.js";

class MemberService {
	async create(member) {
		const createdMember = await Member.create(member);
		return createdMember;
	}

	async getAll() {
		const members = await Member.find();
		return members;
	}

	async getOne(id) {
		if (!id) throw new Error("No ID");
		const member = await Member.findById(id);
		return member;
	}

	async update(member) {
		if (!member._id) throw new Error("No ID");
		const updatedMember = await Member.findByIdAndUpdate(
			member._id,
			member,
			{new: true}
		);
		return updatedMember;
	}

	async delete(id) {
		if (!id) throw new Error("No ID");
		const member = await Member.findByIdAndDelete(id);
		return member;
	}
}

export default new MemberService();
