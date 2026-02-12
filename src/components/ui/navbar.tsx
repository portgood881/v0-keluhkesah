"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import Link from 'next/link'
import { Github, Mail } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from './dialog'
import Image from 'next/image'
import { Switch } from './switch'
import { Label } from './label'

interface NavbarProps {
    isWibuMode: boolean;
    setIsWibuMode: (value: boolean) => void;
  }

  export const Navbar = ({ isWibuMode, setIsWibuMode }: NavbarProps) => {
    const [hasLogo, setHasLogo] = useState(true)
    const [logoSrc, setLogoSrc] = useState('/keluhkesah.png')

    return (
        <nav className="fixed top-0 right-0 w-full z-50 border-b-4 border-border bg-bg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {isWibuMode && hasLogo ? (
          <Image
            src={logoSrc}
            alt="Keluh Kesah Logo"
            width={48}
            height={48}
            className="object-contain h-12 w-auto"
            unoptimized
            onError={() => {
              if (logoSrc !== '/keluhkesah.svg') setLogoSrc('/keluhkesah.svg')
              else setHasLogo(false)
            }}
          />
        ) : (
          <div className="font-bold text-lg">Keluh Kesah</div>
        )}
          <div className="flex items-center gap-4">
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="neutral">Tentang</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Tentang Keluh Kesah</DialogTitle>
                <DialogDescription>
                  Keluh Kesah adalah adalah tempat bagi siapa saja untuk mencurahkan isi hati dan berbagi pengalaman. Platform ini dibuat dengan tujuan untuk mengurangi angka stress di Indonesia.
                </DialogDescription>
                <div className="flex items-center gap-2">
                <Switch id="wibu-mode" className="z-10" checked={isWibuMode} onCheckedChange={(checked) => setIsWibuMode(checked)}/>
          <Label htmlFor="wibu-mode" className="z-10">
            Wibu Mode
          </Label>
                </div>
                
            </DialogContent>
          </Dialog>
            <Link href="mailto:contact@keluhkesah.cc"><Button variant="neutral" className="w-10 h-10" aria-label="Contact support"><Mail /></Button></Link>
            <ModeToggle />
            
          </div>
        </div>
      </nav>
    )
}