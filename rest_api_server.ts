import { Application, Router } from "https://deno.land/x/oak@v4.0.0/mod.ts";

// MODEL
type Student = {
  id: number;
  name: string;
  course: string;
};

// DATABASE
const students: Student[] = [
  {
    id: 1,
    name: "Jeff",
    course: "Sistemas para internet",
  },
];

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
});


// CONTROLLER
const router = new Router();

router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/student", (context) => {
    context.response.body = students;
  })
  .get("/student/:id", (context) => {
    if (context.params && context.params.id) {
      const id = context.params.id;
      context.response.body = students.find((student) =>
        student.id === parseInt(id)
      );
    } else {
      context.response.status = 404;
      context.response.body = "Student not found!";
    }
  })
  .put("/student/:id", async (context) => {
    let id: number = 0;
    let name: string;
    let course: string;
    if (context.params && context.params.id) {
      id = Number.parseInt(context.params.id);
      if (students.find((student) => student.id === id)) {
        console.log("student founded!");
      } else {
        console.log("student not founded!");
        context.response.status = 404;
        return;
      }
      /*let str = JSON.stringify(context.params);
      console.log('Search of student: ' + JSON.stringify(students.find(student => student.id === id)));
      console.log(`ìd: ${id}, context: ${str}.`);*/
    } else {
      context.response.status = 400;
      return;
    }
    const body = await context.request.body();
    if (!body.value.name || !body.value.course) {
      context.response.status = 400;
      return;
    }
    name = body.value.name;
    course = body.value.course;
    console.log(`{ "ìd": ${id}, "name": "${name}", "course": "${course}" }`);
    students[id - 1] = { id: id, name: name, course: course };
    context.response.body = "Student updated!";
    context.response.status = 200;
    return;
  })
  .post("/student", async (context) => {
    const body = await context.request.body();
    if (!body.value.name || !body.value.course) {
      context.response.status = 400;
      return;
    }
    const newStudent: Student = {
      id: students.length + 1,
      name: body.value.name,
      course: body.value.course,
    };
    students.push(newStudent);
    context.response.status = 201;
    context.response.body = "New student added!";
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
