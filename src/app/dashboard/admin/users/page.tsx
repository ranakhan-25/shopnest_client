"use client";

import { useEffect, useState } from "react";
import { Magnifier, Person, TrashBin, Gear } from "@gravity-ui/icons";
import { ShieldCheck, Users, UserCog } from "lucide-react";

import { apiFetch } from "@/lib/apiClient";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "seller" | "admin";
  profileImage?: string;
  createdAt?: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
    };
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* =========================
     Fetch Users
  ========================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams();

      if (search.trim()) {
        query.set("search", search.trim());
      }

      if (role !== "all") {
        query.set("role", role);
      }

      const res = await apiFetch(`/api/admin/users?${query.toString()}`);

      const result: UserResponse = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch users");
      }

      setUsers(result?.data?.users || []);
    } catch (error) {
      console.error("Fetch users error:", error);

      setError(error instanceof Error ? error.message : "Something went wrong");

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, role]);

  /* =========================
     Delete User
  ========================= */

  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(userId);

      const res = await apiFetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user._id !== userId));

      alert(result.message);
    } catch (error) {
      console.error("Delete user error:", error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
     Change Role
  ========================= */

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    try {
      setUpdatingId(userId);

      const res = await apiFetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({
          role: newRole,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user,
        ),
      );

      alert(result.message);
    } catch (error) {
      console.error("Update role error:", error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================
     Stats
  ========================= */

  const totalUsers = users.length;

  const totalAdmins = users.filter((user) => user.role === "admin").length;

  const totalSellers = users.filter((user) => user.role === "seller").length;

  const normalUsers = users.filter((user) => user.role === "user").length;

  return (
    <section className="w-full space-y-6">
      {/* =========================
          Header
      ========================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl ">User Management</h1>

              <p className="text-sm text-muted-foreground">
                Manage users, sellers and administrators
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Stats
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Customers
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {normalUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <Person className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Sellers */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sellers
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
                {totalSellers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <UserCog className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Admins
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">
                {totalAdmins}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Search & Filter
      ========================= */}

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}

          <div className="relative flex-1">
            <Magnifier className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="
                w-full rounded-xl
                border border-border
                bg-background
                py-3 pl-10 pr-4
                text-sm text-foreground
                outline-none
                placeholder:text-muted-foreground
                focus:border-primary
                focus:ring-2 focus:ring-primary/20
              "
            />
          </div>

          {/* Role Filter */}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="
              rounded-xl
              border border-border
              bg-background
              px-4 py-3
              text-sm text-foreground
              outline-none
              focus:border-primary
            "
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* =========================
          Content
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Loading */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

              <p className="mt-3 text-sm text-muted-foreground">
                Loading users...
              </p>
            </div>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="flex min-h-[300px] items-center justify-center p-6">
            <div className="text-center">
              <p className="font-medium text-red-500">{error}</p>

              <button
                onClick={fetchUsers}
                className="
                  mt-4 rounded-lg
                  bg-primary px-4 py-2
                  text-sm font-medium
                  text-primary-foreground
                  hover:opacity-90
                "
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}

        {!loading && !error && users.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-foreground">
              No users found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              No users match your current search or filter.
            </p>
          </div>
        )}

        {/* Desktop Table */}

        {!loading && !error && users.length > 0 && (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Joined
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    {/* User */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            user.name?.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}

                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value as User["role"],
                          )
                        }
                        className={`
                          rounded-lg border
                          px-3 py-1.5
                          text-xs font-semibold
                          outline-none
                          ${getRoleStyle(user.role)}
                        `}
                      >
                        <option value="user">User</option>

                        <option value="seller">Seller</option>

                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Date */}

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Settings"
                          className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-lg border border-border
                            text-muted-foreground
                            hover:bg-muted
                            hover:text-foreground
                          "
                        >
                          <Gear className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                          title="Delete user"
                          className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            text-red-500
                            hover:bg-red-500/10
                            disabled:opacity-50
                          "
                        >
                          <TrashBin className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile */}

        {!loading && !error && users.length > 0 && (
          <div className="divide-y divide-border md:hidden">
            {users.map((user) => (
              <div key={user._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id}
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-lg
                      text-red-500
                      hover:bg-red-500/10
                    "
                  >
                    <TrashBin className="size-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <select
                    value={user.role}
                    disabled={updatingId === user._id}
                    onChange={(e) =>
                      handleRoleChange(user._id, e.target.value as User["role"])
                    }
                    className={`
                      rounded-lg border
                      px-3 py-2
                      text-xs font-semibold
                      outline-none
                      ${getRoleStyle(user.role)}
                    `}
                  >
                    <option value="user">User</option>

                    <option value="seller">Seller</option>

                    <option value="admin">Admin</option>
                  </select>

                  <span className="text-xs text-muted-foreground">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================
   Stat Card
========================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Role Style
========================= */

function getRoleStyle(role: User["role"]) {
  switch (role) {
    case "admin":
      return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";

    case "seller":
      return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400";

    default:
      return "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400";
  }
}
