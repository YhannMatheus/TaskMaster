import * as React from 'react'
import { Tailwind, Section, Text } from '@react-email/components'
import { Container } from '@react-email/container'
import { Hr } from '@react-email/hr'

export default function OTPEmail({ otp }: { otp: number }) {
    return (
        <Tailwind>
            <Container className="mx-auto py-8 px-4 font-sans">
                <Section className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-md mx-auto overflow-hidden">
                    {/* Header */}
                    <Section className="bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-6 text-center">
                        <Text className="text-2xl font-bold text-white m-0">
                            TaskMaster
                        </Text>
                        <Text className="text-violet-100 text-sm mt-1 mb-0">
                            Sistema de Gerenciamento de Tarefas
                        </Text>
                    </Section>

                    {/* Content */}
                    <Section className="px-8 py-6 text-center">
                        <Text className="text-lg font-semibold text-gray-800 mb-2">
                            Confirme seu endereço de email
                        </Text>
                        
                        <Text className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Olá! Para concluir seu cadastro no TaskMaster, use o código de verificação abaixo:
                        </Text>

                        {/* OTP Code Box */}
                        <Section className="bg-gray-50 border-2 border-dashed border-violet-300 rounded-lg py-6 px-4 mb-6">
                            <Text className="text-4xl font-bold text-violet-600 tracking-wider mb-0">
                                {otp}
                            </Text>
                            <Text className="text-xs text-gray-500 mt-2 mb-0">
                                Código de Verificação
                            </Text>
                        </Section>

                        <Text className="text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
                            ⏰ Este código é válido por 10 minutos
                        </Text>

                        <Hr className="border-gray-200 my-4" />

                        <Text className="text-gray-500 text-xs mb-2">
                            Se você não solicitou este código, pode ignorar este email com segurança.
                        </Text>
                        
                        <Text className="text-gray-600 text-sm font-medium">
                            Obrigado por se juntar ao TaskMaster! 🚀
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
                        <Text className="text-xs text-gray-400 mb-0">
                            © 2025 TaskMaster - Todos os direitos reservados a Porãygua Dev Group
                        </Text>
                    </Section>
                </Section>
            </Container>
        </Tailwind>
    )
}

OTPEmail.PreviewProps = {
    otp: 123456
}