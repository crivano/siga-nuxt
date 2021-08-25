import Vue from 'vue'
import ptBR from 'vee-validate/dist/locale/pt_BR'
import {
  ValidationProvider,
  ValidationObserver,
  extend
} from 'vee-validate';
import {
  required,
  email,
} from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: "Preenchimento obrigatório"
});

extend('email', {
  ...email,
  message: "Email inválido"
});

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

ptBR.messages.cpf = field => 'CPF ' + field + ' inválido.'
ptBR.messages.cnpj = field => 'CNPJ ' + field + ' inválido.'
ptBR.messages.oab = field => 'OAB ' + field + ' inválido.'
