import { prisma } from '../prisma';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
}

class DatabaseManager {
  async createUser(firstName: string, lastName: string, password: string): Promise<{ id: string }> {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        password,
      },
    });
    
    return { id: user.id };
  }

  async getUserByName(firstName: string, lastName: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        firstName,
        lastName,
      },
    });
    
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    
    return user;
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id'>>): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id },
        data: updates,
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const db = new DatabaseManager();
