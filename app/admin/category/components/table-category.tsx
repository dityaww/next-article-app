import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ReactNode } from "react"

export default function TableCategory({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return(
        <Table>
            <TableHeader className="bg-slate-200">
                <TableRow>
                    <TableHead className="text-center font-medium text-sm py-3 px-4 leading-5">Category</TableHead>
                    <TableHead className="text-center font-medium text-sm py-3 px-4 leading-5">Created At</TableHead>
                    <TableHead className="text-center font-medium text-sm py-3 px-4 leading-5">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {children}
            </TableBody>
        </Table>
    )
}