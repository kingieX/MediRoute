/**
 * PUT /users/:id
 * Update a user (Admin only)
 */
router.put('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, role, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let updateData: any = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
