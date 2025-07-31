"use client";
import { Card, Image, Text, Badge, Button, Group, useMantineTheme } from '@mantine/core';

export default function ModalidadesCard() {
  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === 'dark'
      ? theme.colors.dark[1]
      : theme.colors.gray[7];

  return (
    <div style={{ width: 340, margin: 'auto' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://placekitten.com/340/160"
            height={160}
            alt="Imagem do card"
          />
          <Badge
            color="pink"
            variant="light"
            size="sm"
            style={{ position: 'absolute', top: 8, right: 8 }}
          >
            Promoção
          </Badge>
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Título do card</Text>
        </Group>

        <Text size="sm" color="dimmed">
          Aqui vai uma breve descrição do produto, serviço ou conteúdo que o card representa.
        </Text>

        <Button color="blue" fullWidth mt="md" radius="xs">
          Ver Mais
        </Button>
      </Card>
    </div>
  );
}
