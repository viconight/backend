import { promises as fs } from 'fs'
import config from '../config.js'

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = `${config.fileSystem.path}/${ruta}`;
    }

    async listar(id) {
        const objs = await this.listarAll();
        const buscado = objs.find(o => o.id == id);
        return buscado;
    }

    async listarAll() {
        try {
            const objs = await fs.readFile(this.ruta, 'utf-8');
            return JSON.parse(objs);
        } catch (error) {
            return [];
        }
    }

    async guardar(obj) {
        const objs = await this.listarAll();

        let newId
        if (objs.length == 0) {
            newId = 1;
        } else {
            newId = objs[objs.length - 1].id + 1;
        }
        
        const newObj = { id: newId, ...obj };
        objs.push(newObj);

        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
            return newObj
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`);
        }
    }

    async agregarProducto(obj, id) {
        const objs = await this.listarAll();
        const index = objs.findIndex(o => o.id == id);
        
        if (index == -1) {
            return undefined;
        } else {
            objs[index].productos.push(obj);
            try {
                await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
                return objs[index].productos;
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`);
            }
        }
    }

    async actualizar(id, elem) {
        const objs = await this.listarAll();
        const index = objs.findIndex(o => o.id == id);
        if (index == -1) {
            // throw new Error(`Error al actualizar: no se encontró el id ${id}`)
            return undefined;
        } else {
            objs[index] = elem;
            try {
                await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
                return objs[index];
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`);
            }
        }
    }

    async borrar(id) {
        const objs = await this.listarAll()
        const index = objs.findIndex(o => o.id == id);
        if (index == -1) {
            // throw new Error(`Error al borrar: no se encontró el id ${id}`)
            return undefined;
        }

        objs.splice(index, 1)
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`);
        }
    }

    async borrarProducto(id, id_prod) {
        const objs = await this.listarAll();
        const index = objs.findIndex(o => o.id == id);
        
        if (index == -1) {
            return 0;
        }

        const indexProd = objs[index].productos.findIndex(o => o.id == id_prod);

        if (indexProd == -1) {
            return 0; 
        }

        objs[index].productos.splice(indexProd, 1);

        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
            return 1;
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`);
        }
    }

    async borrarAll() {
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}

export default ContenedorArchivo