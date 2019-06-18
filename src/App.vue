<template>
  <div
    id="app"
    class="container"
  >
    <h1>Integração Vue.js com API Node.js</h1>
    <b-alert
      show
      dismissible
      v-for="mensagem in mensagens"
      :key="mensagem.texto"
      :variant="mensagem.tipo"
    >{{ mensagem.texto }}</b-alert>
    <b-card>
      <b-form-group label="Nome:">
        <b-form-input
          type="text"
          size="lg"
          v-model="usuario.name"
          placeholder="Informe o Nome"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="E-mail:">
        <b-form-input
          type="email"
          size="lg"
          v-model="usuario.email"
          placeholder="Informe o E-mail"
        ></b-form-input>
      </b-form-group>
      <hr>
      <b-button
        @click="salvar"
        size="lg"
        variant="success"
      >Salvar</b-button>

    </b-card>
    <br>
    <b-card>
      <b-button
        @click="listarUsuarios"
        size="lg"
        variant="primary"
        class="ml-2"
      >Usuários Cadastrados
      </b-button>
      <div v-if="usuarios.length > 0">
        <h3 class="text-center">Usuários Cadastrados</h3>
        <table class="table table-striped">
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th class="text-center">Ação</th>
          </tr>
          <tr
            v-for="(usuario, index) in usuarios"
            :key="index"
          >
            <td>{{ usuario.name }}</td>
            <td>{{ usuario.email }}</td>
            <td class="text-center">
              <b-button
                variant="warning"
                size="md"
                @click="carregar(index, usuario._id)"
              >Carregar</b-button>
              <b-button
                variant="danger"
                size="md"
                class="ml-2"
                @click="showModal(usuario)"
              >Excluir</b-button>
            </td>
          </tr>
        </table>
      </div>
    </b-card>

    <b-modal
      ref="delete-modal"
      hide-footer
    >
      <div class="d-block text-center">
        <p>Você realmente deseja exluir o usuário {{usuarioPraRemover.name}}?</p>
      </div>
      <b-row>
        <b-col>
          <b-button
            class="mt-2"
            variant="danger"
            block
            @click="hideModal"
          >Cancelar</b-button>
        </b-col>
        <b-col>
          <b-button
            class="mt-2"
            variant="primary"
            block
            @click="excluir"
          >Confirmar</b-button>
        </b-col>
      </b-row>
    </b-modal>

  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mensagens: [],
      usuarios: [],
      id: null,
      usuarioPraRemover: {},
      usuario: {
        name: "",
        email: ""
      }
    };
  },
  methods: {
    listarUsuarios() {
      if (this.usuarios.length < 1) {
        this.obterUsuarios();
      } else {
        this.limparUsuarios();
      }
    },
    limparUsuarios() {
      this.usuarios = [];
    },
    limpar() {
      this.usuario.name = "";
      this.usuario.email = "";
      this.id = null;
      this.mensagens = [];
    },
    carregar(index, id) {
      this.id = id;
      this.usuario = { ...this.usuarios[index] };
    },
    excluir() {
      this.$http
        .delete(`/users/${this.usuarioPraRemover._id}`)
        .then(() => {
          this.limpar();
          this.$refs["delete-modal"].hide();
          this.obterUsuarios();
          this.mensagens.push({
            texto: "Usuário excluído com sucesso.",
            tipo: "success"
          });
        })
        .catch(() => {
          this.limpar();
          this.mensagens.push({
            texto: "Problema para excluir!",
            tipo: "danger"
          });
        });
    },
    salvar() {
      const metodo = this.id ? "put" : "post";
      const finalUrl = this.id ? this.id : "";
      this.$http[metodo](`/users/${finalUrl}`, this.usuario).then(() => {
        this.limpar();
        this.mensagens.push({
          texto: "Operação realizada com sucesso!",
          tipo: "success"
        });
      });
    },
    obterUsuarios() {
      this.$http.get("/users").then(res => {
        this.usuarios = res.data;
      });
    },

    //modal
    showModal(usuario) {
      this.$refs["delete-modal"].show();
      this.usuarioPraRemover = usuario;
    },
    hideModal() {
      this.$refs["delete-modal"].hide();
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 1.5rem;
}

#app h1 {
  text-align: center;
  margin: 50px;
}
</style>
