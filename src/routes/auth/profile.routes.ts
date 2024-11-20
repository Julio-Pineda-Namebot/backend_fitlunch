import { Router } from "express"
import { db } from "../../db"

const router = Router()

router.post("/update_profile", async (req: any, res) => {
  const { X_NOMBRE, X_APELLIDO, X_TELEFONO, X_SEXO, X_FECHA_NAC } = req.body

  try {
    const user = await db.fit_usuario.findUnique({
      where: { N_ID_USUARIO: req.user.userId }
    })
    const fechaNacimiento = new Date(X_FECHA_NAC)
    await db.fit_usuario.update({
      where: { N_ID_USUARIO: req.user.userId },
      data: {
        X_NOMBRE,
        X_APELLIDO,
        X_TELEFONO,
        X_SEXO,
        X_FECHA_NAC: fechaNacimiento
      }
    })

    res.status(200).json({ message: "Perfil actualizado correctamente" })
  } catch (error) {
    console.error("Error al actualizar el perfil:", error)
    res.status(500).json({ message: "Error al actualizar el perfil" })
  }
})

router.post("add_addres", async (req: any, res) => {
  const {
    departamentoId,
    provinciaId,
    distritoId,
    tipo_calle,
    numero,
    es_trabajo,
    es_casa,
    telefono_contacto,
    referencias
  } = req.body

  const N_ID_USUARIO = req.user.userId

  try {
    const newAddress = await db.fit_direccion.create({
      data: {
        N_ID_USUARIO,
        departamentoId,
        provinciaId,
        distritoId,
        tipo_calle,
        numero,
        es_trabajo,
        es_casa,
        telefono_contacto,
        referencias
      }
    })

    res.status(201).json({
      message: "Dirección agregada correctamente",
      address: newAddress
    })
  } catch (error) {
    console.error("Error al agregar la dirección:", error)
    res.status(500).json({ message: "Error al agregar la dirección" })
  }
})

router.put("/update_address/:id", async (req, res) => {
  const { id } = req.params
  const {
    departamentoId,
    provinciaId,
    distritoId,
    tipo_calle,
    numero,
    es_trabajo,
    es_casa,
    telefono_contacto,
    referencias
  } = req.body

  try {
    const address = await db.fit_direccion.update({
      where: { N_ID_DIRECCION: parseInt(id) },
      data: {
        departamentoId,
        provinciaId,
        distritoId,
        tipo_calle,
        numero,
        es_trabajo,
        es_casa,
        telefono_contacto,
        referencias
      }
    })

    res
      .status(200)
      .json({ message: "Dirección actualizada correctamente", address })
  } catch (error) {
    console.error("Error al actualizar la dirección:", error)
    res.status(500).json({ message: "Error al actualizar la dirección" })
  }
})

router.get("/get_addresses", async (req: any, res) => {
  try {
    const addresses = await db.fit_direccion.findMany({
      where: { N_ID_USUARIO: req.user.userId },
      include: {
        departamento: true,
        provincia: true,
        distrito: true
      }
    })

    res.status(200).json({ addresses })
  } catch (error) {
    console.error("Error al obtener las direcciones:", error)
    res.status(500).json({ message: "Error al obtener las direcciones" })
  }
})
export default router
