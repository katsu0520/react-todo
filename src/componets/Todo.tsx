import { FormEvent } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowRightCircleIcon,ShieldCheckIcon } from "@heroicons/react/24/solid"
import useStore from "../store"
import { useQueryTasks } from "../hooks/useQueryTasks"
import { useMutateTask } from "../hooks/useMutateTask"
import { useMutateAuth } from "../hooks/useMutateAuth"
import { TaskItem } from "./TaskItem"
export const Todo = () => {
    const queryClient = useQueryClient()
    const { editedTask } = useStore()
    const updateTask = useStore((state) => state.updateEditedTask)
    const { data, isLoading } = useQueryTasks()
    const { createTaskMutation, updateTaskMutation} = useMutateTask()
    const { logoutMutation} = useMutateAuth()
    const submitTaskHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(editedTask.id === 0)
            createTaskMutation.mutate({
                title: editedTask.title,
            })
        else {
            updateTaskMutation.mutate(editedTask)
        }
    }
    const logout = async () => {
        await logoutMutation.mutateAsync()
        queryClient.removeQueries(['tasks'])
    }
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
        <div className="flex items-center my-3">
            <ShieldCheckIcon className="h-8 w-8 mr-3 text-indigo-500 cursor-pointer" />
            <span className="text-center text-3xl font-extrabold">
                Task manager
            </span>
        </div>
        <ArrowRightCircleIcon
        onClick={logout}
        className="h-6 w-6 my-6 text-blue-500 cursor-pointer"
        />
        <form onSubmit={submitTaskHandler}>
            <input
                className="border border-gray-300 py-2 px-1 mr-1 mb-3"
                placeholder=" TODO??"
                type="text" 
                onChange={(e) => updateTask({...editedTask, title: e.target.value })}
                value={editedTask.title || ''}
            />
            <button
                className="disabled:opacity-40 mx-3 py-2 px-3 text-white bg-indigo-600 rounded"
                disabled={!editedTask}
            >
                {editedTask.id === 0 ? 'Create' : 'Update'}
            </button>
        </form>
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            <ul className="my-5">
                {data?.map((task) => (
                    <TaskItem key={task.id} id={task.id} title={task.title} />
                ))}
            </ul>
        )

        }
    </div>
  )
}
