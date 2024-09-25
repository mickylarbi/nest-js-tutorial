import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users = [
        { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", role: 'INTERN' },
        { id: 2, name: "Bob Smith", email: "bob.smith@example.com", role: 'ENGINEER' },
        { id: 3, name: "Charlie Brown", email: "charlie.brown@example.com", role: 'ADMIN' },
        { id: 4, name: "Diana Prince", email: "diana.prince@example.com", role: 'INTERN' },
        { id: 5, name: "Ethan Hunt", email: "ethan.hunt@example.com", role: 'ENGINEER' },
        { id: 6, name: "Fiona Green", email: "fiona.green@example.com", role: 'ADMIN' },
        { id: 7, name: "George Lucas", email: "george.lucas@example.com", role: 'INTERN' },
        { id: 8, name: "Hannah Montana", email: "hannah.montana@example.com", role: 'ENGINEER' },
        { id: 9, name: "Ian Malcolm", email: "ian.malcolm@example.com", role: 'ADMIN' },
        { id: 10, name: "Julia Roberts", email: "julia.roberts@example.com", role: 'INTERN' }
    ]

    findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
        if (role) return this.users.filter(user => user.role === role)

        return this.users
    }

    findOne(id: number) {
        const user = this.users.find(user => user.id === id)

        if(!user) throw new NotFoundException('User not found')
        return user
    }

    create(createUserDto: CreateUserDto) {
        const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id)

        const newUser = {
            id: usersByHighestId[0].id + 1,
            ...createUserDto
        }

        this.users.push(newUser)
        return newUser
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        this.users = this.users.map(user => user.id === id ? { ...user, ...updateUserDto } : user)

        return this.findOne(id)
    }

    delete(id: number) {
        const removedUser = this.findOne(id)

        this.users = this.users.filter(user => user.id !== id)

        return removedUser
    }

}
