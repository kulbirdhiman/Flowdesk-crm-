"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Plus, 
  ChevronDown,
  List,
  Grid,
  LayoutGrid
} from "lucide-react";

interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  jobTypeFilter: string[];
  setJobTypeFilter: (filters: string[]) => void;
  employmentTypeFilter: string[];
  setEmploymentTypeFilter: (filters: string[]) => void;
  statusFilter: string[];
  setStatusFilter: (filters: string[]) => void;
  view: 'list' | 'grid' | 'kanban';
  setView: (view: 'list' | 'grid' | 'kanban') => void;
  employees: any[];
  onClearFilters: () => void;
  onAddEmployee: () => void;
}

export default function EmployeeFilters({
  searchTerm,
  setSearchTerm,
  jobTypeFilter,
  setJobTypeFilter,
  employmentTypeFilter,
  setEmploymentTypeFilter,
  statusFilter,
  setStatusFilter,
  view,
  setView,
  employees,
  onClearFilters,
  onAddEmployee
}: EmployeeFiltersProps) {
  const toggleFilter = (currentFilters: string[], setFilters: (filters: string[]) => void, value: string) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter(f => f !== value));
    } else {
      setFilters([...currentFilters, value]);
    }
  };

  const toggleSelectAll = (
    currentFilters: string[], 
    setFilters: (filters: string[]) => void, 
    allValues: string[]
  ) => {
    if (currentFilters.length === allValues.length) {
      setFilters([]);
    } else {
      setFilters(allValues);
    }
  };

  const renderViewToggle = () => (
    <div className="flex items-center border rounded-md">
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setView('list')}
        className="rounded-r-none"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setView('grid')}
        className="rounded-none border-x"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setView('kanban')}
        className="rounded-l-none"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex-shrink-0 bg-white dark:bg-card rounded-t-xl border border-border dark:border-border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4 w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search employees..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                {jobTypeFilter.length === 0 ? "All Job Types" : `${jobTypeFilter.length} selected`}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
              <div className="max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-job-types"
                      checked={jobTypeFilter.length === Array.from(new Set(employees
                        .map(emp => emp.job_title)
                        .filter(title => title && title.trim() !== '')
                        .map(title => title!.trim())
                      )).length}
                      onCheckedChange={() => toggleSelectAll(
                        jobTypeFilter, 
                        setJobTypeFilter, 
                        Array.from(new Set(employees
                          .map(emp => emp.job_title)
                          .filter(title => title && title.trim() !== '')
                          .map(title => title!.trim())
                        ))
                      )}
                    />
                    <label htmlFor="select-all-job-types" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Select All
                    </label>
                  </div>
                </div>
                <div className="p-1">
                  {Array.from(new Set(employees
                    .map(emp => emp.job_title)
                    .filter(title => title && title.trim() !== '')
                    .map(title => title!.trim())
                  )).map(jobTitle => (
                    <div key={jobTitle} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                      <Checkbox
                        id={`job-${jobTitle}`}
                        checked={jobTypeFilter.includes(jobTitle)}
                        onCheckedChange={() => toggleFilter(jobTypeFilter, setJobTypeFilter, jobTitle)}
                      />
                      <label htmlFor={`job-${jobTitle}`} className="text-sm text-gray-900 dark:text-gray-100">
                        {jobTitle}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                {employmentTypeFilter.length === 0 ? "All Employment Types" : `${employmentTypeFilter.length} selected`}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
              <div className="max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-employment-types"
                      checked={employmentTypeFilter.length === Array.from(new Set(employees
                        .map(emp => emp.employment_type)
                        .filter(type => type && type.trim() !== '')
                        .map(type => type!.trim())
                      )).length}
                      onCheckedChange={() => toggleSelectAll(
                        employmentTypeFilter, 
                        setEmploymentTypeFilter, 
                        Array.from(new Set(employees
                          .map(emp => emp.employment_type)
                          .filter(type => type && type.trim() !== '')
                          .map(type => type!.trim())
                        ))
                      )}
                    />
                    <label htmlFor="select-all-employment-types" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Select All
                    </label>
                  </div>
                </div>
                <div className="p-1">
                  {Array.from(new Set(employees
                    .map(emp => emp.employment_type)
                    .filter(type => type && type.trim() !== '')
                    .map(type => type!.trim())
                  )).map(employmentType => (
                    <div key={employmentType} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                      <Checkbox
                        id={`employment-${employmentType}`}
                        checked={employmentTypeFilter.includes(employmentType)}
                        onCheckedChange={() => toggleFilter(employmentTypeFilter, setEmploymentTypeFilter, employmentType)}
                      />
                      <label htmlFor={`employment-${employmentType}`} className="text-sm text-gray-900 dark:text-gray-100">
                        {employmentType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                {statusFilter.length === 0 ? "All Status" : `${statusFilter.length} selected`}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
              <div className="max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-status"
                      checked={statusFilter.length === Array.from(new Set(employees
                        .map(emp => emp.status)
                        .filter(status => status && status.trim() !== '')
                        .map(status => status!.trim())
                      )).length}
                      onCheckedChange={() => toggleSelectAll(
                        statusFilter, 
                        setStatusFilter, 
                        Array.from(new Set(employees
                          .map(emp => emp.status)
                          .filter(status => status && status.trim() !== '')
                          .map(status => status!.trim())
                        ))
                      )}
                    />
                    <label htmlFor="select-all-status" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Select All
                    </label>
                  </div>
                </div>
                <div className="p-1">
                  {Array.from(new Set(employees
                    .map(emp => emp.status)
                    .filter(status => status && status.trim() !== '')
                    .map(status => status!.trim())
                  )).map(status => (
                    <div key={status} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                      <Checkbox
                        id={`status-${status}`}
                        checked={statusFilter.includes(status)}
                        onCheckedChange={() => toggleFilter(statusFilter, setStatusFilter, status)}
                      />
                      <label htmlFor={`status-${status}`} className="text-sm text-gray-900 dark:text-gray-100">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="whitespace-nowrap"
          >
            Clear Filters
          </Button>
          
          {renderViewToggle()}
          
          <Button onClick={onAddEmployee}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>
    </div>
  );
}
