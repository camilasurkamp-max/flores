


import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("flores.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS flores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cor TEXT NOT NULL,
    nome_cientifico TEXT NOT NULL
  );
`);

function listar() {
  return db.getAllSync("SELECT * FROM flores ORDER BY id DESC");
}

function adicionar(nome, cor, nomeCientifico) {
  db.runSync(
    "INSERT INTO flores (nome, cor, nome_cientifico) VALUES (?, ?, ?)",
    [nome, cor, nomeCientifico]
  );
}

function excluir(id) {
  db.runSync("DELETE FROM flores WHERE id = ?", [id]);
}

function atualizar(id, nome, cor, nomeCientifico) {
  db.runSync(
    "UPDATE flores SET nome = ?, cor = ?, nome_cientifico = ? WHERE id = ?",
    [nome, cor, nomeCientifico, id]
  );
}

export default function ListaFlores() {
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("");
  const [nomeCientifico, setNomeCientifico] = useState("");
  const [lista, setLista] = useState([]);
  const [idEditando, setIdEditando] = useState(null);

  function carregar() {
    setLista(listar());
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setNome("");
    setCor("");
    setNomeCientifico("");
    setIdEditando(null);
  }

  function salvar() {
    if (
      nome.trim() === "" ||
      cor.trim() === "" ||
      nomeCientifico.trim() === ""
    ) 

    if (idEditando === null) {
      adicionar(nome.trim(), cor.trim(), nomeCientifico.trim());
    } else {
      atualizar(
        idEditando,
        nome.trim(),
        cor.trim(),
        nomeCientifico.trim()
      );
    }

    limpar();
    carregar();
  }

  function editar(item) {
    setNome(item.nome);
    setCor(item.cor);
    setNomeCientifico(item.nome_cientifico);
    setIdEditando(item.id);
  }

  function remover(id) {
    excluir(id);

    if (idEditando === id) {
      limpar();
    }

    carregar();
  }

  return (
    <SafeAreaView style={styles.tela} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Lista de flores",
          headerStyle: { backgroundColor: "#C00000" },
          headerTintColor: "#FFFFFF",
        }}
      />

      

      <TextInput
        style={styles.campo}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome da flor"
        placeholderTextColor="#000000"
      />

      <TextInput
        style={styles.campo}
        value={cor}
        onChangeText={setCor}
        placeholder="Cor"
        placeholderTextColor="#000000"
      />

      <TextInput
        style={styles.campo}
        value={nomeCientifico}
        onChangeText={setNomeCientifico}
        placeholder="Nome científico"
        placeholderTextColor="#000000"
      />

     

      {idEditando !== null && (
        <View style={styles.cancelar}>
          <Button
            title="Cancelar edição"
            onPress={limpar}
            color="#000000"
          />
        </View>
      )}

      <FlatList
        style={styles.lista}
        data={lista}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemTexto}>Cor: {item.cor}</Text>
            <Text style={styles.itemTexto}>
              Nome científico: {item.nome_cientifico}
            </Text>

            <View style={styles.botoes}>
              <View style={styles.botao}>
                <Button
                  title="Editar"
                  onPress={() => editar(item)}
                  color="#000000"
                />
              </View>

              <View style={styles.botao}>
                <Button
                  title="Excluir"
                  onPress={() => remover(item.id)}
                  color="#000000"
                />
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },

  campo: {
    borderWidth: 1,
    borderColor: "#D9DDE3",
    borderRadius: 1,
    padding: 12,
    fontSize: 16,
    color: "#000000",
    marginBottom: 12,
  },

  cancelar: {
    marginTop: 8,
  },

  lista: {
    flex: 1,
    marginTop: 16,
  },

  item: {
    backgroundColor: "#D9DDE3",
    borderRadius: 1,
    padding: 16,
    marginBottom: 8,
  },

  itemNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },

  itemTexto: {
    fontSize: 14,
    color: "#000000",
    marginTop: 4,
  },

  botoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  botao: {
    flex: 1,
  },
});