'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  IconCurrencyDollar,
  IconHome,
  IconList,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SettingsPage() {
  const settingsOptions = [
    {
      title: 'Usuários',
      description: 'Gerencie seus usuários',
      icon: <IconUsers size={28} stroke={2} className="text-blue-500" />,
      href: '/settings/users',
    },
    {
      title: 'Unidades',
      description: 'Configure suas acomodações',
      icon: <IconHome size={28} stroke={2} className="text-rose-500" />,
      href: '/settings/units',
    },
    {
      title: 'Tarifas',
      description: 'Gerencie tipos de tarifa',
      icon: (
        <IconCurrencyDollar size={28} stroke={2} className="text-green-500" />
      ),
      href: '/settings/rates',
    },
    {
      title: 'Serviços',
      description: 'Adicione serviços extras',
      icon: <IconList size={28} stroke={2} className="text-orange-500" />,
      href: '/settings/services',
    },
    {
      title: 'Configurações avançadas',
      description: 'Regras de preço e reservas',
      icon: <IconSettings size={28} stroke={2} className="text-purple-500" />,
      href: '/settings/advanced',
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <Separator className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map(option => (
          <motion.div
            key={option.title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="hover:shadow-md transition">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {option.icon}
                  <div>
                    <h2 className="text-lg font-semibold">{option.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                <Link href={option.href}>
                  <Button variant="outline" className="w-full mt-4">
                    Gerenciar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
