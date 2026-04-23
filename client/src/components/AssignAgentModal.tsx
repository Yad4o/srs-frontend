import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getAgents, type AgentListItem } from '@/api/admin'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface AssignAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (agentId: number) => Promise<void>
}

export function AssignAgentModal({
  isOpen,
  onClose,
  onConfirm,
}: AssignAgentModalProps) {
  const [agents, setAgents] = useState<AgentListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<number | ''>('')
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      getAgents()
        .then((res) => {
          setAgents(res.data)
        })
        .catch(() => {
          toast.error('Failed to load agents')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setSelectedAgentId('') // Reset on close
    }
  }, [isOpen])

  const handleConfirm = async () => {
    if (!selectedAgentId) return
    setIsAssigning(true)
    try {
      await onConfirm(selectedAgentId as number)
      onClose()
    } catch (error) {
      toast.error('Failed to assign agent')
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Agent</DialogTitle>
          <DialogDescription>
            Select an agent to handle this escalated ticket.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-text-secondary" />
            </div>
          ) : (
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(Number(e.target.value))}
              className="w-full p-2 border border-bg-border rounded bg-bg-surface text-text-primary focus:outline-none focus:border-accent-blue"
            >
              <option value="" disabled>
                Select an agent...
              </option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.email}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isAssigning}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedAgentId || isAssigning || loading}
          >
            {isAssigning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
