import React from 'react'
import { PlusCircle } from 'lucide-react';
import { Button } from './UI/Button';
import { Tabs, TabsList, TabsTrigger } from './UI/Tabs';
const TableHeader = () =>  {
  return (
    <div className='flex items-center justify-between mb-5'>
      
      <div>
        <h1 className='text-3xl'>Transcriptions</h1>
        <p>All your transcriptions in one place</p>
      </div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Processing</TabsTrigger>
            <TabsTrigger value="draft">Done</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      
    </div>
  )
}

export default TableHeader