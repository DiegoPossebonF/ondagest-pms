'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  IconBuilding,
  IconCurrencyReal,
  IconHome,
  IconHomeRibbon,
  IconUsers,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SettingsPage() {
  const settingsOptions = [
    {
      title: 'Organização',
      description: 'Configure os dados da sua organização (Empresa)',
      icon: <IconBuilding size={40} stroke={2} className="text-gray-500" />,
      href: '/settings/organization',
    },
    {
      title: 'Usuários',
      description: 'Gerencie seus usuários',
      icon: <IconUsers size={40} stroke={2} className="text-blue-500" />,
      href: '/settings/users',
    },
    {
      title: 'Unidades',
      description: 'Configure suas acomodações',
      icon: <IconHome size={40} stroke={2} className="text-rose-500" />,
      href: '/settings/units',
    },
    {
      title: 'Tipos de Unidade',
      description: 'Gerencie tipos de suas acomodações',
      icon: <IconHomeRibbon size={40} stroke={2} className="text-orange-500" />,
      href: '/settings/unit_types',
    },
    {
      title: 'Tarifas',
      description: 'Gerencie tipos de tarifa',
      icon: (
        <IconCurrencyReal size={40} stroke={2} className="text-green-500" />
      ),
      href: '/settings/rates',
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <Separator className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {settingsOptions.map((option, index) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.2 }}
            className="h-full" // faz o motion.div ocupar toda a altura
          >
            <Card className="hover:shadow-md transition h-full flex flex-col">
              <CardContent className="p-4 flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-4">
                  {option.icon}
                  <div>
                    <h2 className="text-lg font-semibold">{option.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link href={option.href}>
                    <Button variant="outline" size="sm" className="w-full">
                      Gerenciar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
