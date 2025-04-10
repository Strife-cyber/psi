import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, Lock,
  ChevronDown, Copy, Edit, Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SecurityScore from "@/components/security-score";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Password, Entry, BreadcrumbItem } from "@/index";
import usePasswordHook from "@/hooks/password-hook";
import useEntryHook from "@/hooks/entry-hooks";
import AppLayout from "@/layouts/app-layout";
import Detail from "@/components/detail";

const ITEMS_PER_PAGE = 10; // Reduced from 20
const MOTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PasswordsPage() {
  const { getAllPasswords } = usePasswordHook();
  const { getEntries } = useEntryHook();

  const [passwords, setPasswords] = useState<Password[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Memoized data fetching
  const fetchData = useCallback(async () => {
    try {
      const [passwordData, entryData] = await Promise.all([
        getAllPasswords(),
        getEntries()
      ]);
      setPasswords(passwordData || []);
      setEntries(entryData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [getAllPasswords, getEntries]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized filtering and pagination
  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    const lowerQuery = searchQuery.toLowerCase();
    return entries.filter(
      entry => entry.title.toLowerCase().includes(lowerQuery) ||
               entry.description.toLowerCase().includes(lowerQuery)
    );
  }, [entries, searchQuery]);

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

  // Memoized selected entry and password
  const selectedEntry = useMemo(() => 
    entries.find(entry => entry.id === selectedId) || null,
    [entries, selectedId]
  );
  
  const selectedPassword = useMemo(() => 
    passwords.find(p => p.id === selectedEntry?.password) || null,
    [passwords, selectedEntry]
  );

  const formatDate = useCallback((date: Date) => 
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }), []);

  const handleEntrySelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const breadcrumbs: BreadcrumbItem[] = [{ title: "Passwords", href: "/passwords" }];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col gap-4 p-2 sm:p-4 h-full">
        <Card className="flex-1 overflow-hidden">
          <CardHeader>
            <CardTitle>Password Manager</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search entries..."
                className="pl-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid xl:grid-cols-3 gap-4 p-4">
              {/* Details Panel */}
              <motion.div
                variants={MOTION_VARIANTS}
                initial="hidden"
                animate="visible"
                className="xl:sticky xl:top-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Entry Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEntry && selectedPassword ? (
                      <div className="space-y-4 text-sm">
                        <SecurityScore score={selectedPassword.strengthScore * 100} />
                        <Detail label="Title" value={selectedEntry.title} />
                        <Detail label="Description" value={selectedEntry.description} />
                        <Detail
                          label="Password"
                          value={selectedPassword.value}
                          show={showPassword}
                          setShow={setShowPassword}
                          copyable
                        />
                        <Badge variant="outline">
                          Unique: {selectedPassword.isUnique ? "Yes" : "No"}
                        </Badge>
                        <p>Created: {formatDate(selectedEntry.createdAt)}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Lock className="h-6 w-6 text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Select an entry to view details
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Entries List */}
              <motion.div
                variants={MOTION_VARIANTS}
                initial="hidden"
                animate="visible"
                className="xl:col-span-2"
              >
                <ScrollArea className="h-[60vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead>Strength</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEntries.map((entry) => {
                        const password = passwords.find(p => p.id === entry.password);
                        const strengthScore = password?.strengthScore || 0;
                        return (
                          <TableRow
                            key={entry.id}
                            className="cursor-pointer"
                            onClick={() => handleEntrySelect(entry.id)}
                          >
                            <TableCell>{entry.title}</TableCell>
                            <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                              {entry.description}
                            </TableCell>
                            <TableCell>
                              <div className="h-2 w-16 rounded-full bg-muted">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    strengthScore * 100 > 80 ? "bg-emerald-500" :
                                    strengthScore * 100 > 60 ? "bg-amber-500" :
                                    "bg-destructive"
                                  )}
                                  style={{ width: `${strengthScore * 100}%` }}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" /> Copy
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="flex justify-between p-4 text-sm">
                  <span>
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredEntries.length)} of{" "}
                    {filteredEntries.length} entries
                  </span>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}