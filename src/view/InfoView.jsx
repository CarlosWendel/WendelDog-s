import { Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView, View, StyleSheet } from "react-native"
import { Card, Divider } from "react-native-paper"




const InfoView = () => {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
               
                <Card style={styles.headerCard}>
                    <Card.Content>
                        <Text variant="headlineMedium" style={styles.title}>
                            🌭 WendelDo's
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            cachorro quente é aqui!
                        </Text>
                    </Card.Content>
                </Card>

              
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.cardTitle}>
                            📍 Sobre Nós
                        </Text>
                        <Divider style={styles.divider} />
                        <Text variant="bodyMedium" style={styles.text}>
                            Há mais de 10 anos servindo sabor e qualidade em cada cachorro-quente!
                            Trabalhamos com ingredientes frescos e selecionados, oferecendo um atendimento acolhedor e rápido para garantir a melhor experiência gastronômica aos nossos clientes.
                            Nosso compromisso é transformar cada lanche em um momento de prazer e satisfação!
                        </Text>
                    </Card.Content>
                </Card>

               
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.cardTitle}>
                            🕒 Horário de Funcionamento
                        </Text>
                        <Divider style={styles.divider} />

                        <View style={styles.horarioItem}>
                            <Text style={styles.dia}>Segunda à Sexta:</Text>
                            <Text style={styles.horario}>19:00 - 00:00</Text>
                        </View>

                        <View style={styles.horarioItem}>
                            <Text style={styles.dia}>Domingos:</Text>
                            <Text style={styles.horario}>10:00 - 00:00</Text>
                        </View>

                        <View style={styles.horarioItem}>
                            <Text style={styles.dia}>Sabados:</Text>
                            <Text style={styles.horarioFechado}>Fechado</Text>
                        </View>
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.cardTitle}>
                            📞 Contatos
                        </Text>
                        <Divider style={styles.divider} />

                        <View style={styles.contatoItem}>
                            <Text style={styles.contatoTipo}>Telefone:</Text>
                            <Text style={styles.contatoInfo}>(11) 9999-8888</Text>
                        </View>

                        <View style={styles.contatoItem}>
                            <Text style={styles.contatoTipo}>WhatsApp:</Text>
                            <Text style={styles.contatoInfo}>(11) 98888-7777</Text>
                        </View>

                        <View style={styles.contatoItem}>
                            <Text style={styles.contatoTipo}>E-mail:</Text>
                            <Text style={styles.contatoInfo}>contato@wendeldos.com</Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* ENDEREÇO */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.cardTitle}>
                            🗺️ Endereço
                        </Text>
                        <Divider style={styles.divider} />
                        <Text variant="bodyMedium" style={styles.text}>
                            Av Rio Branco, 123{"\n"}
                            Centro{"\n"}
                            Juiz de Fora -MG{"\n"}
                            CEP: 01234-567
                        </Text>
                    </Card.Content>
                </Card>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 16,
    },
    headerCard: {
        backgroundColor: '#3b82f6',
        marginBottom: 16,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        color: 'white',
        textAlign: 'center',
        opacity: 0.9,
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    cardTitle: {
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    divider: {
        marginVertical: 8,
        backgroundColor: '#e5e7eb',
    },
    text: {
        color: '#4b5563',
        lineHeight: 22,
    },
    horarioItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    dia: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    horario: {
        fontSize: 16,
        color: '#059669',
        fontWeight: 'bold',
    },
    horarioFechado: {
        fontSize: 16,
        color: '#dc2626',
        fontWeight: 'bold',
    },
    contatoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    contatoTipo: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    contatoInfo: {
        fontSize: 16,
        color: '#3b82f6',
        fontWeight: 'bold',
    },
    servicoItem: {
        fontSize: 16,
        color: '#4b5563',
        paddingVertical: 4,
        lineHeight: 24,
    }
});

export default InfoView