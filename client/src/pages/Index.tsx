import { TableHeader } from "../components/TableHeader"
import { TranscriptionTable as Table } from "../components/TranscriptionTable"

interface TableProps {
  file?:File
}

export const Index:React.FC<TableProps> = ({file}):JSX.Element => {
  return (
    <>
        <TableHeader/>
        <Table file={file}/>
    </>
  )
}

