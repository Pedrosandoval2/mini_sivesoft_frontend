import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { changeTenant } from '@/services/switch-bussiness/changeTenant'
import { useUserStore } from '@/store/userStore'

export default function SelectCompanyPage() {
  const [selectedCompany, setSelectedCompany] = useState('')
  const setUser = useUserStore((state) => state.setUser)
  const companies = [
    { id: 'empresa1', name: 'Empresa 1' },
    { id: 'empresa2', name: 'Empresa 2' },
    { id: 'empresa3', name: 'Empresa 3' },
  ]
  const navigate = useNavigate()

  const handleConfirm = async () => {
    if (selectedCompany) {
      const response = await changeTenant({ tenantId: selectedCompany })
      if (response.status === 201){
        setUser({...response.data.user, token: response.data.token })
      }
      navigate('/warehouses')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Seleccionar Empresa
          </CardTitle>
          <CardDescription className="text-center">
            Elija la empresa con la que desea trabajar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6 w-full">
            <Label htmlFor="company">Empresa</Label>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Seleccione una empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full"
            disabled={!selectedCompany}
          >
            Confirmar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
