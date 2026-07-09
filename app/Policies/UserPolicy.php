<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /** Both admins and sub-admins may browse the member list. */
    public function viewAny(User $actor): bool
    {
        return $actor->isStaff();
    }

    public function view(User $actor, User $target): bool
    {
        return $actor->isStaff();
    }

    /** Only a full admin may create accounts — including other staff. */
    public function create(User $actor): bool
    {
        return $actor->isAdmin();
    }

    /**
     * Sub-admins get read-only access to users, so they can never change a
     * role, an e-mail, or a password on somebody else's account.
     */
    public function update(User $actor, User $target): bool
    {
        return $actor->isAdmin();
    }

    public function delete(User $actor, User $target): bool
    {
        if (! $actor->isAdmin()) {
            return false;
        }

        // Deleting yourself, or the last admin, would lock the panel.
        if ($actor->is($target)) {
            return false;
        }

        if ($target->isAdmin() && User::where('role', User::ROLE_ADMIN)->count() <= 1) {
            return false;
        }

        return true;
    }

    public function deleteAny(User $actor): bool
    {
        return $actor->isAdmin();
    }
}
