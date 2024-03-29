import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTasks } from "../../redux/actions";
import { updateTask } from "../../redux/actions";
import { TaskIcon } from "../../Components/TaskIcon";
import { ButtonTask } from "../../Components/ButtonTask";
import { FaAngleDown as DowmIcon, FaCircleExclamation } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { validateInputs } from "./validate";
import { getTasks } from "../../redux/getTasks";
import { ToBack } from "../../Components/ToBack";
import { useTranslation } from "react-i18next";

const CreateTask = ({ id }) => {
  const { t } = useTranslation("global");
  const allTasks = getTasks();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [errors, setErrors] = useState({ title: t("create.message") });

  const task = allTasks.find((task) => task?.id === id) || {
    id: "",
    title: "",
    description: "",
    pogress: false,
    time: "",
    taskGroup: "unspecified",
  };
  const [toDo, setToDo] = useState(task);

  const getTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    let format = "AM";
    if (hours > 12) {
      hours -= 12;
      format = "PM";
    }

    return `${hours}:${minutes} ${format}`;
  };

  const capitalizeWord = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const generatorUUID = () => {
    return uuidv4();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleGroup = (type) => {
    setToDo({ ...toDo, taskGroup: type });
    setShowMenu(!showMenu);
  };

  const handleIconDown = () => {
    setShowMenu(!showMenu);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setToDo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors(
      validateInputs({
        ...toDo,
        [name]: value,
      })
    );
  };
  const taskGroup = [
    { type: "work_project" },
    { type: "personal_project" },
    { type: "welfare" },
    { type: "daily_study" },
    { type: "unspecified" },
  ];

  const saveTask = () => {
    if (id) {
      dispatch(
        updateTask({
          ...toDo,
          time: getTime(),
        })
      );
      navigate(-1);
    } else {
      if (errors.title) {
        return;
      }

      const clearTodo = {
        id: "",
        title: "",
        description: "",
        time: "",
        pogress: false,
      };

      const task = {
        ...toDo,
        id: generatorUUID(),
        title: capitalizeWord(toDo.title),
        description: capitalizeWord(toDo.description),
        time: getTime(),
      };

      dispatch(setTasks(allTasks, task, toDo.taskGroup));
      setToDo(clearTodo);
      navigate("/tasks/all");
    }
  };

  return (
    <div className="h-full">
      {id && <ToBack path={-1} />}
      <div className="flex flex-col items-center gap-4 pb-24">
        <h2 className="text-center text-lg font-bold my-4">
          {id ? t("title.edit") : t("title.create")}
        </h2>
        {!id && (
          <div className="w-4/5 max-w-md ">
            <div
              className="flex items-center relative w-full mb-3 h-[3.6rem]"
              onClick={handleIconDown}
            >
              <p className="absolute top-1.5 text-xxs left-14 text-cust-intermediate">
                {t("home.task_group")}
              </p>
              <span className="absolute left-3">
                <TaskIcon type={toDo.taskGroup} />
              </span>
              <input
                className="w-full h-full px-14 p-y-3 rounded-lg outline-none text-sm text-cust-secondary font-semibold shadow-md"
                value={t(`task_group.${toDo.taskGroup}`)}
                type="text"
                readOnly
              />
              <div
                className={`${
                  showMenu ? "scale-y-[-1] transition-all ease-out" : ""
                } transition-all ease-out flex items-center justify-center absolute right-3 w-8 h-full`}
              >
                <DowmIcon color="gray" />
              </div>
            </div>

            <ul
              className={`${
                showMenu
                  ? "flex flex-col gap-2 text-xs text-cust-secondary bg-tranparent shadow-sm rounded-lg"
                  : "hidden"
              } `}
            >
              {taskGroup.map(({ type }) => (
                <li
                  key={type}
                  onClick={() => handleGroup(type)}
                  className="flex items-center gap-4 h-11 w-full px-4 bg-white rounded-lg"
                >
                  <TaskIcon type={type} />
                  <p>{t(`task_group.${type}`)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <form
          className="flex flex-col items-center w-full gap-5"
          onSubmit={handleSubmit}
        >
          <label
            className="flex flex-col relative w-4/5 max-w-md h-14 bg-white p-3 text-cust-intermediate text-xs border shadow-sm rounded-lg"
            color="gray"
          >
            {t("create.title")}
            <input
              className="w-full h-full bg-transparent text-sm font-normal text-cust-secondary outline-none"
              onChange={handleChange}
              value={toDo.title}
              name="title"
              type="text"
            />
            {errors.title && (
              <div className="text-cust-primary flex gap-2 items-center absolute top-2.5 right-5  bg-slate-100 rounded-lg pl-1">
                <small className="">{errors.title}</small>
                <FaCircleExclamation />
              </div>
            )}
          </label>

          <label className="flex flex-col w-4/5 h-32 max-w-md bg-white p-3 text-cust-intermediate text-xs border shadow-sm rounded-lg">
            {t("create.description")}

            <textarea
              className="w-full h-full bg-transparent text-sm font-normal text-cust-secondary outline-none"
              onChange={handleChange}
              value={toDo.description}
              name="description"
            />
          </label>
        </form>

        <ButtonTask
          content={t("create.button")}
          onClick={saveTask}
          background={"bg-customPurple-100"}
          color={"text-cust-primary"}
        />
      </div>
    </div>
  );
};

export { CreateTask };
